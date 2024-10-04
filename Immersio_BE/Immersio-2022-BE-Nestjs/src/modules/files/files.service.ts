import {Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    ConflictException,
    OnModuleInit,} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { GetListFilesDto } from './dto/get-list-files.dto';
import { v4 as uuid } from 'uuid';
import pdfChecker from 'src/utils/pdf-checker';
import imageChecker from 'src/utils/image-checker';
import s3, { replaceWithLinkCDN } from 'src/helpers/s3';
import { ConfigService } from '@nestjs/config';
import videoChecker from 'src/utils/video-checker';
import { FileType, Folder } from '@prisma/client';
import getFileExtension from 'src/utils/get-extension';
import { UploadFileDto } from './dto/upload-file.dto';
import { PublicFileDto } from './dto/public-file.dto';
import * as sharp from 'sharp';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { jwtConstants } from '../auth/constants';
import { join } from 'path';
import * as archiver from 'archiver';
import { PassThrough } from 'stream';
import { SendEmailHelper } from 'src/helpers/send-email';
import { SendShareEmailDto } from './dto/send-share-email';
import { AddExternalFileDto } from './dto/add-external-file.dto';
import { ChangeExternalFileLinkDto } from './dto/change-external-file-link.dto';
import { GetCountFilesDto } from './dto/get-count-files';
import audioChecker from 'src/utils/audio-checker';
import { extToMimeTypes } from 'src/utils/ext-to-mime';
import documentationChecker from 'src/utils/documentation-checker';
import presentationChecker from 'src/utils/presentation-checker';
import sheetChecker from 'src/utils/sheet-checker';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

@Injectable()
export class FilesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectKysely() private db: Kysely<DB>
    ) { }

    async findAll(
        userId: string,
        {
            skip,
            take,
            cursorId,
            search,
            folderId,
            sortBy,
            sortDesc,
        }: GetListFilesDto
    ) {
        const fileList = await this.db
            .selectFrom('File')
            .$if(!!skip, eb => eb.offset(skip))
            .$if(!!take, eb => eb.limit(take ?? 50))
            .$if(!!search, eb => eb.where('name', 'ilike', `%${search}%`))
            .$if(folderId === 'root', eb => eb.where('folderId', 'is', null))
            .$if(!!folderId && folderId !== 'root', eb => eb.where('folderId', '=', folderId))
            .$if(!!sortBy && !!sortDesc, eb => eb.orderBy(sortBy as any, sortDesc ? 'desc' : 'asc'))
            .selectAll()
            .where('userId', '=', userId)
            .select(eb => [
                'id', 'name', 'ext', 'externalLink', 'type', 'public', 'size', 'createdAt', 'updatedAt',
                jsonObjectFrom(eb.selectFrom('Folder').whereRef('id', '=', 'folderId').select(['id', 'name'])).as('folder'),
                jsonObjectFrom(eb.selectFrom('Thumbnail').whereRef('fileId', '=', 'File.id').select(['id', 's3Key'])).as('thumbnail'),
                jsonObjectFrom(eb.selectFrom('User').whereRef('id', '=', 'File.userId').select(eb => [
                    'id',
                    jsonObjectFrom(eb.selectFrom('Profile').whereRef('userId', '=', 'User.id').select(['firstName', 'lastName'])).as('profile')
                ])).as('user'),
            ])
            .execute();
        await Promise.all(
            fileList.map(async (file: any) => {
                if (file.thumbnail) {
                    file.thumbnail = replaceWithLinkCDN(
                        await s3.getSignedUrlPromise('getObject', {
                            Bucket: this.configService.get('AWS_BUCKET_NAME'),
                            Key: file.thumbnail.s3Key,
                        })
                    );
                }
            })
        );
        if (!fileList) throw new NotFoundException('File List Not Found');
        return fileList;
    }

    async count(userId: string, { search, folderId }: GetCountFilesDto) {
        const result = await this.db
            .selectFrom('File')
            .$if(!!search, eb => eb.where('name', 'ilike', `%${search}%`))
            .$if(!!folderId, eb => eb.where('folderId', '=', folderId))
            .where('userId', '=', userId)
            .select(eb => [
                jsonObjectFrom(eb.fn.count('id').distinct()).as('total')
            ])
            .executeTakeFirst();
        return result.total;
    }

    async addExternalFile(
        userId: string,
        { name, folderId, link }: AddExternalFileDto
    ) {
        const ext = getFileExtension(name);
        // if (!ext) throw new BadRequestException('Missing extension in name');
        this._checkIfNameExisted(name.replace(ext, ''), folderId);

        return this.prisma.file.create({
            data: {
                name: name.replace(`.${ext}`, ''),
                ext,
                externalLink: link,
                userId,
            },
            select: {
                id: true,
                name: true,
                ext: true,
                externalLink: true,
                type: true,
                public: true,
                size: true,
                folder: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                thumbnail: {
                    select: {
                        id: true,
                        s3Key: true,
                        externalLink: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async uploadFile(
        userId: string,
        dataBuffer: Buffer,
        filename: string,
        { name, folderId, public: isPublic }: UploadFileDto
    ) {
        const s3Name = uuid();
        const ext = getFileExtension(filename);
        const uploadResult = await s3
            .upload({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Body: dataBuffer,
                Key: `${userId}/${s3Name}.${ext}`,
                ContentType: extToMimeTypes[`.${ext}`],
                ACL: 'public-read',
            })
            .promise();

        let type: FileType = FileType.OTHER;
        let s3Thumbnail: ManagedUpload.SendData;
        let resizedImage: Buffer;
        let parentFolder: Folder;

        if (videoChecker(filename)) {
            type = FileType.VIDEO;
            if (!folderId)
                parentFolder = await this.db
                    .selectFrom('Folder')
                    .where('name', '=', 'Video')
                    .where('userId', '=', userId)
                    .where('fixed', '=', true)
                    .selectAll()
                    .executeTakeFirst();
        } else if (audioChecker(filename)) {
            type = FileType.AUDIO;
            if (!folderId)
                parentFolder = await this.db
                    .selectFrom('Folder')
                    .where('name', '=', 'Audio')
                    .where('userId', '=', userId)
                    .where('fixed', '=', true)
                    .selectAll()
                    .executeTakeFirst();
        } else if (imageChecker(filename)) {
            type = FileType.IMAGE;
            if (!folderId)
                parentFolder = await this.db
                    .selectFrom('Folder')
                    .where('name', '=', 'Image')
                    .where('userId', '=', userId)
                    .where('fixed', '=', true)
                    .selectAll()
                    .executeTakeFirst();
            resizedImage = await sharp(dataBuffer, {
                limitInputPixels: false,
            })
                .resize({
                    width: 255,
                    height: 255,
                    withoutEnlargement: true,
                    fit: 'inside',
                })
                .webp()
                .toBuffer();

            s3Thumbnail = await s3
                .upload({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Body: resizedImage,
                    Key: `${userId}/thumbnail/${s3Name}.webp`,
                })
                .promise();
        } else if (pdfChecker(filename)) {
            type = FileType.PDF;
        } else if (documentationChecker(filename)) {
            type = FileType.DOCUMENTATION;
        } else if (presentationChecker(filename)) {
            type = FileType.PRESENTATION;
        } else if (sheetChecker(filename)) {
            type = FileType.SHEET;
        }

        const sameNameFile = await this.db
            .selectFrom('File')
            .where('name', '=', name)
            .$if(folderId && folderId !== 'root', (qb) =>
                qb.where('folderId', '=', folderId)
            )
            .selectAll()
            .executeTakeFirst();

        const fileName = name
            ? sameNameFile
                ? name + `-${uuid()}`
                : name
            : filename.replace(`.${ext}`, '');

        return this.prisma.file.create({
            data: {
                userId,
                name: fileName,
                folderId:
                    folderId && folderId !== 'root'
                        ? folderId
                        : parentFolder && folderId !== 'root'
                            ? parentFolder.id
                            : undefined,
                type,
                ext,
                size: dataBuffer.byteLength,
                s3Key: uploadResult.Key,
                s3Location: uploadResult.Location,
                public: isPublic,
                thumbnail: s3Thumbnail
                    ? {
                        create: {
                            s3Key: s3Thumbnail.Key,
                            s3Location: s3Thumbnail.Location,
                            userId,
                        },
                    }
                    : undefined,
            },
            select: {
                id: true,
                name: true,
                ext: true,
                externalLink: true,
                type: true,
                public: true,
                size: true,
                folder: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                s3Location: true,
                thumbnail: {
                    select: {
                        id: true,
                        s3Key: true,
                        externalLink: true
                    },
                },
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const { s3Key, s3Location, ...result } = await this._findOne(id);
        return result;
    }

    async findOnePublic(id: string) {
        const { s3Key, s3Location, ...result } = await this._findOne(id);
        if (!result.public) throw new ForbiddenException();
        return result;
    }

    async getOneTimeLinkPublic(id: string) {
        // const file = await this.prisma.file.findUnique({
        //     where: {
        //         id,
        //     },
        //     include: {
        //         folder: true,
        //         thumbnail: true,
        //         user: {
        //             select: {
        //                 profile: {
        //                     select: {
        //                         firstName: true,
        //                         lastName: true,
        //                     },
        //                 },
        //             },
        //         },
        //         courses: {
        //             select: {
        //                 id: true,
        //             },
        //             where: {
        //                 isFree: true,
        //             },
        //         },
        //     },
        // });
        const file = await this.db
            .selectFrom('File')
            .where('id', '=', id)
            .selectAll()
            .select(eb => [
                jsonObjectFrom(eb.selectFrom('Folder').whereRef('id', '=', 'File.folderId').selectAll()).as('folder'),
                jsonObjectFrom(eb.selectFrom('Thumbnail').whereRef('fileId', '=', 'File.id').selectAll()).as('thumbnail'),
                jsonObjectFrom(eb.selectFrom('User').whereRef('id', '=', 'File.userId').select((eb) => [
                    jsonObjectFrom(eb.selectFrom('Profile').whereRef('userId', '=', 'User.id').select(['firstName', 'lastName'])).as('profile')
                ])).as('user'),
                jsonArrayFrom(eb.selectFrom('Course').whereRef('instructionVideoId', '=', 'File.id').where('isFree', '=', true).select('id')).as('courses')
            ])
            .executeTakeFirst();
        if (!file) throw new NotFoundException();
        if (!file.public) throw new ForbiddenException();
        if (file.s3Key)
            return replaceWithLinkCDN(
                await s3.getSignedUrlPromise('getObject', {
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: file.s3Key,
                })
            );
        else if (file.externalLink)
            return file.externalLink;
        else return null;
    }

    async getOneTimeLink(userId: string, id: string) {
        // const file = await this.prisma.file.findUnique({
        //     where: {
        //         id,
        //     },
        //     include: {
        //         folder: true,
        //         thumbnail: true,
        //         user: {
        //             select: {
        //                 profile: {
        //                     select: {
        //                         firstName: true,
        //                         lastName: true,
        //                     },
        //                 },
        //             },
        //         },
        //         courses: {
        //             select: {
        //                 id: true,
        //             },
        //             where: {
        //                 isFree: true,
        //             },
        //         },
        //     },
        // });

        const file = await this.db
            .selectFrom('File')
            .where('id', '=', id)
            .selectAll()
            .select(eb => [
                jsonObjectFrom(eb.selectFrom('Folder').whereRef('id', '=', 'File.folderId').selectAll()).as('folder'),
                jsonObjectFrom(eb.selectFrom('Thumbnail').whereRef('fileId', '=', 'File.id').selectAll()).as('thumbnail'),
                jsonObjectFrom(eb.selectFrom('User').whereRef('id', '=', 'File.userId').select((eb) => [
                    jsonObjectFrom(eb.selectFrom('Profile').whereRef('userId', '=', 'User.id').select(['firstName', 'lastName'])).as('profile')
                ])).as('user'),
                jsonArrayFrom(eb.selectFrom('Course').whereRef('instructionVideoId', '=', 'File.id').where('isFree', '=', true).select('id')).as('courses')
            ])
            .executeTakeFirst();
        if (!file) throw new NotFoundException();
        if (!file.public && file.userId !== userId && file.courses.length < 0)
            throw new ForbiddenException();
        if (file.s3Key)
            return replaceWithLinkCDN(
                await s3.getSignedUrlPromise('getObject', {
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: file.s3Key,
                })
            );
        else if (file.externalLink)
            return file.externalLink;
        else return null;
    }

    async sendShareEmail(userId: string, { fileId, email }: SendShareEmailDto) {
        const file = await this._findOne(fileId);
        if (file.userId !== userId) throw new ForbiddenException();
        if (!file.public || !file.token)
            throw new BadRequestException('This file is not public');
        const templatePath = join(
            __dirname,
            './../../../client/html/mydrive-share-link.html'
        );
        //TODO: replace with real data
        const _emailHelper = new SendEmailHelper();
        _emailHelper.send(email, 'Share link down mydrive', templatePath, {
            name: `${file.user?.profile?.firstName} ${file.user?.profile?.lastName}`,
            link: file.token,
            host: 'https://api.immersio.io',
        });
        return;
    }

    async getThumbnail(userId: string, id: string) {
        const file = await this._findOne(id);
        if (!file.public && file.userId !== userId)
            throw new ForbiddenException();
        if (!file.thumbnail) throw new NotFoundException();
        if (file.externalLink)
            return file.externalLink;
        return replaceWithLinkCDN(
            await s3.getSignedUrlPromise('getObject', {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: file.thumbnail.s3Key,
            })
        );
    }

    async getThumbnailFromThumbnailId(userId: string, id: string) {
        const thumbnail = await this.db
            .selectFrom('Thumbnail')
            .where('id', '=', id)
            .select(['s3Key', 'externalLink'])
            .executeTakeFirst();
        if (!thumbnail) throw new NotFoundException();
        if (thumbnail.externalLink)
            return thumbnail.externalLink;
        // if (!thumbnail.public && thumbnail.userId !== userId)
        //     throw new ForbiddenException();
        return replaceWithLinkCDN(
            await s3.getSignedUrlPromise('getObject', {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: thumbnail.s3Key,
            })
        );
    }

    async download(userId: string, id: string) {
        const file = await this._findOne(id);
        if (file.userId !== userId) throw new ForbiddenException();
        if (file.externalLink)
            throw new BadRequestException('Cannot download external file');
        const nameHasExt = !!getFileExtension(file.name);
        const name = `${file.name}${nameHasExt ? '' : `.${file.ext}`}`;
        return {
            name,
            stream: s3
                .getObject({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: file.s3Key,
                })
                .createReadStream(),
        };
    }

    async downloadMultiples(userId: string, ids: string[]) {
        const files = await this.prisma.file.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        const archive = archiver('zip', {
            zlib: {
                level: 5,
            },
        });
        files
            .filter((file) => file.s3Key)
            .map((file) => {
                if (!file.public && file.userId !== userId) return;
                const passthrough = new PassThrough();
                s3.getObject({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: file.s3Key,
                })
                    .createReadStream()
                    .pipe(passthrough);
                // name parameter is the name of the file that the file needs to be when unzipped.
                const nameHasExt = !!getFileExtension(file.name);
                archive.append(passthrough, {
                    name: `${file.name}${!nameHasExt && `.${file.ext}`}`,
                });
            });
        return archive;
    }

    async publicDownload(token: string) {
        const file = await this._findOneByToken(token);
        const nameHasExt = !!getFileExtension(file.name);
        const name = `${file.name}${!nameHasExt && `.${file.ext}`}`;
        return {
            name,
            stream: s3
                .getObject({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: file.s3Key,
                })
                .createReadStream(),
        };
    }

    async rename(userId: string, id: string, name?: string) {
        const file = await this._findOne(id);
        this._checkIfNameExisted(name, file.folderId);
        if (file.userId !== userId) throw new ForbiddenException();
        return this.db
            .updateTable('File')
            .where('id', '=', id)
            .set({
                name,
                updatedAt: new Date(),
            })
            .returningAll()
            .executeTakeFirst();
    }

    async changeExternalLink(
        userId: string,
        id: string,
        { link }: ChangeExternalFileLinkDto
    ) {
        const file = await this._findOne(id);
        if (file.userId !== userId) throw new ForbiddenException();
        return this.db
            .updateTable('File')
            .where('id', '=', id)
            .set({
                externalLink: link,
                updatedAt: new Date(),
            })
            .returningAll()
            .executeTakeFirst();
    }

    async move(userId: string, id: string, folderId?: string) {
        const file = await this._findOne(id);
        this._checkIfNameExisted(file.name, folderId);
        if (file.userId !== userId) throw new ForbiddenException();
        return this.db
            .updateTable('File')
            .where('id', '=', id)
            .set({
                folderId,
                updatedAt: new Date(),
            })
            .returningAll()
            .executeTakeFirst();
    }

    async changePublicStatus(
        userId: string,
        id: string,
        { public: isPublic }: PublicFileDto
    ) {
        const file = await this._findOne(id);
        if (file.userId !== userId) throw new ForbiddenException();

        return this.prisma.file.update({
            where: {
                id,
            },
            data: {
                public: isPublic,
                token: isPublic
                    ? jwt.sign(
                        {
                            id: file.id,
                            userId,
                        },
                        jwtConstants.fileTokenSecret
                    )
                    : null,
            },
        });
    }

    async delete(userId: string, ids: string[]) {
        const files = await this.prisma.file.findMany({
            where: {
                id: {
                    in: ids,
                },
                userId,
            },
            include: {
                thumbnail: true,
            },
        });

        const internalFiles = files.filter((f) => !f.externalLink);
        const externalFiles = files.filter((f) => f.externalLink);

        if (externalFiles.length > 0) {
            await this.db
                .deleteFrom('File')
                .where(
                    'id',
                    'in',
                    externalFiles.map((i) => i.id)
                )
                .execute();
        }

        if (internalFiles.length <= 0)
            return {
                count: 0,
            };
        const result = await s3
            .deleteObjects({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Delete: {
                    Objects: [
                        ...internalFiles.map((file) => ({
                            Key: file.s3Key,
                        })),
                        ...internalFiles
                            .filter((file) => file.thumbnail)
                            .map((file) => ({
                                Key: file.thumbnail.s3Key,
                            })),
                    ],
                },
            })
            .promise();
        if (result.Errors.length > 0) {
            return result.Errors;
        } else {
            return this.db
                .deleteFrom('File')
                .where(
                    's3Key',
                    'in',
                    result.Deleted.map((file) => file.Key)
                )
                .returningAll()
                .execute();
        }
    }

    private async _findOne(id: string) {
        const result = await this.db
            .selectFrom('File')
            .where('id', '=', id)
            .selectAll()
            .select((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Folder')
                        .whereRef('id', '=', 'File.folderId')
                        .selectAll()
                ).as('folder'),
                jsonObjectFrom(
                    eb
                        .selectFrom('Thumbnail')
                        .whereRef('fileId', '=', 'File.id')
                        .selectAll()
                ).as('thumbnail'),
                jsonObjectFrom(
                    eb
                        .selectFrom('Profile')
                        .whereRef('userId', '=', 'File.userId')
                        .select(['firstName', 'lastName'])
                ).as('profile'),
            ])
            .executeTakeFirst();
        const file = {
            ...result,
            user: {
                profile: result.profile
            },
        };
        if (!file) throw new NotFoundException();
        return file;
    }

    private async _findOneByToken(token: string) {
        const file = await this.db
            .selectFrom('File')
            .where('token', '=', token)
            .selectAll()
            .select((eb) => [
                jsonObjectFrom(
                    eb
                        .selectFrom('Folder')
                        .whereRef('id', '=', 'File.folderId')
                        .selectAll()
                ).as('folder'),
            ])
            .executeTakeFirst();
        if (!file) throw new NotFoundException();
        return file;
    }

    private async _checkIfNameExisted(name: string, folderId: string) {
        const file = await this.db
            .selectFrom('File')
            .where('name', '=', name)
            .where('folderId', '=', folderId)
            .executeTakeFirst();
        if (file) throw new ConflictException('Duplicate name');
    }
}
