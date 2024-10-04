import {Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import s3 from 'src/helpers/s3';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { GetCountFoldersDto } from './dto/get-count-folders';
import { GetListFoldersDto } from './dto/get-list-folders.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

@Injectable()
export class FoldersService {
    constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @InjectKysely() private db: Kysely<DB>
    ) { }
    async create(
        userId: string,
        { name, parentFolderId, public: isPublic }: CreateFolderDto
    ) {
        await this._checkIfNameExisted(userId, name, parentFolderId);
        return this.prisma.folder.create({
            data: {
                name,
                userId: userId,
                parentFolderId,
                public: isPublic,
            },
        });
    }

    async findAll(
        userId: string,
        {
            skip,
            take,
            cursorId,
            search,
            parentFolderId,
            fixed,
            sortBy,
            sortDesc,
        }: GetListFoldersDto
    ) {
        const folders = await this.db
            .selectFrom('Folder')
            .$if(!!skip, eb => eb.offset(skip))
            .$if(!!take, eb => eb.limit(take ?? 50))
            .$if(!!search, eb => eb.where('name', 'ilike', `%${search}%`))
            .where('userId', '=', userId)
            .$if(typeof fixed === 'boolean', eb => eb.where('fixed', '=', fixed))
            .$if(parentFolderId === 'root', eb => eb.where('parentFolderId', 'is', null))
            .$if(!!parentFolderId && parentFolderId !== 'root', eb => eb.where('parentFolderId', '=', parentFolderId))
            .$if(!!sortBy && !!sortDesc, eb => eb.orderBy(sortBy as any, sortDesc ? 'desc' : 'asc'))
            .selectAll()
            .select(eb => [
                jsonObjectFrom(eb.selectFrom('Folder').whereRef('id', '=', 'Folder.parentFolderId')).as('parentFolder')
            ])
            .execute();

        if (!folders) throw new NotFoundException('File List Not Found');
        return folders;
    }

    async count(userId: string, { search, parentFolderId }: GetCountFoldersDto) {
        return this.prisma.folder.count({
            where: {
                name: {
                    contains: search || '', mode: 'insensitive' 
                },
                userId: userId,
                parentFolderId: parentFolderId === 'root' ? null : parentFolderId,
            },
        });
    }

    async findOne(userId: string, id: string) {
        const folder = await this.prisma.folder.findUnique({
            where: {
                id 
            },
            include: {
                files: {
                    where: {
                        userId 
                    } 
                }, folders: {
                    where: {
                        userId 
                    } 
                } 
            },
        });
        if (!folder) throw new NotFoundException();
        if (folder.userId !== userId) throw new ForbiddenException();
        folder.files.map((f) => {
            delete f.s3Key;
            delete f.s3Location;
        });
        return folder;
    }

    async rename(userId: string, id: string, name?: string) {
        const folder = await this._findOne(id);
        await this._checkIfNameExisted(userId, name, folder.parentFolderId);
        if (folder.userId !== userId || folder.fixed)
            throw new ForbiddenException();
        return this.db.updateTable('Folder')
            .where('id', '=', id)
            .set({
                name, updatedAt: new Date() 
            })
            .returningAll()
            .executeTakeFirst();
    }

    async move(userId: string, id: string, parentFolderId?: string) {
        const folder = await this._findOne(id);
        await this._checkIfNameExisted(userId, folder.name, parentFolderId);
        if (folder.userId !== userId || folder.fixed)
            throw new ForbiddenException();
        return this.prisma.folder.update({
            where: {
                id 
            },
            data: {
                parentFolderId 
            },
        });
    }

    async delete(userId: string, ids: string[]) {
    // const folders = await this.prisma.folder.findMany({
    //   where: { id: { in: ids }, userId, fixed: false },
    //   include: { files: true },
    // });
        const folders = await this.db.selectFrom('Folder')
            .where('id', 'in', ids)
            .where('userId', '=', userId)
            .where('fixed', '=', false)
            .selectAll()
            .select(eb => [
                jsonArrayFrom(
                    eb.selectFrom('File')
                        .whereRef('folderId', '=', 'Folder.id')
                        .selectAll()
                ).as('files')
            ])
            .execute();

        await Promise.all(
            folders.map(async (folder) => {
                const folderKeys = folder.files.map((file) => ({
                    Key: file.s3Key 
                }));
                if (folderKeys.length > 0)
                    await s3
                        .deleteObjects({
                            Bucket: this.configService.get('AWS_BUCKET_NAME'),
                            Delete: {
                                Objects: folderKeys,
                            },
                        })
                        .promise();
                await this.prisma.folder.delete({
                    where: {
                        id: folder.id 
                    } 
                });
            })
        );

        return true;
    }

    private async _findOne(id: string) {
        const folder = await this.db.selectFrom('Folder')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        if (!folder) throw new NotFoundException();
        return folder;
    }

    private async _checkIfNameExisted(
        userId: string,
        name: string,
        parentFolderId: string | undefined
    ) {
        const folder = await this.db.selectFrom('Folder')
            .where('userId', '=', userId)
            .where('name', '=', name)
            .where('parentFolderId', '=', parentFolderId)
            .executeTakeFirst();
        if (folder) throw new ConflictException('Duplicated name!');
    }
}
