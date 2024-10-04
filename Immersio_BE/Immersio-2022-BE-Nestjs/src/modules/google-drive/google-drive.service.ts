import { Injectable, NotFoundException } from '@nestjs/common';
import {createFile,
    deleteFile,
    downloadFile,
    getGGDriveInstance,
    listFiles,
    listFolders,
    moveFileToFolder,
    renameFile,} from 'src/helpers/google-drive';
import { UploadFileDto } from '../files/dto/upload-file.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoogleDriveFileDto } from './dto/create-google-drive-file.dto';
import { CreateGoogleDriveDto } from './dto/create-google-drive.dto';
import { CredentialGoogleDriveDto } from './dto/credential-google-drive.dto';
import { GetGoogleDriveFileDto } from './dto/get-google-drive-file.dto';
import { MoveGoogleDriveFileDto } from './dto/move-google-drive-file.dto';
import { RenameGoogleDriveFileDto } from './dto/rename-google-drive-file.dto';
import { UpdateGoogleDriveDto } from './dto/update-google-drive.dto';
const { Readable } = require('stream');

@Injectable()
export class GoogleDriveService {
    constructor(private readonly prisma: PrismaService) {}
    async credential(
        userId: string,
        {
            googleClientId,
            googleClientSecret,
            googleRefreshToken,
        }: CredentialGoogleDriveDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        await this.prisma.subdomainSetting.upsert({
            where: {
                subdomainId: user.subdomainId 
            },
            create: {
                subdomainId: user.subdomainId,
                googleClientId,
                googleClientSecret,
                googleRefreshToken,
            },
            update: {
                googleClientId,
                googleClientSecret,
                googleRefreshToken,
            },
        });
        return true;
    }
    async create(createGoogleDriveDto: CreateGoogleDriveDto) {}

    async findAllFiles(
        userId: string,
        { folderId, pageSize, pageToken }: GetGoogleDriveFileDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        return listFiles(drive, pageSize, pageToken, folderId);
    }

    async findAllFolders(
        userId: string,
        { folderId, pageSize, pageToken }: GetGoogleDriveFileDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        return listFolders(drive, pageSize, pageToken, folderId);
    }

    async download(res: any, userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        return downloadFile(drive, res, id);
    }

    async move(userId: string, id: string, { folderId }: MoveGoogleDriveFileDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        await moveFileToFolder(drive, id, folderId);
        return true;
    }

    async rename(userId: string, id: string, { name }: RenameGoogleDriveFileDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        await renameFile(drive, id, name);
        return true;
    }

    async remove(userId: string, id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        await deleteFile(drive, id);
        return true;
    }

    private async _getInstance(subdomainId: string) {
        const settings = await this.prisma.subdomainSetting.findUnique({
            where: {
                subdomainId 
            },
        });
        if (
            !settings ||
      !settings?.googleClientId ||
      !settings?.googleClientSecret ||
      !settings?.googleRefreshToken
        )
            throw new NotFoundException('Google credential not found!');
        return getGGDriveInstance(
            settings.googleClientId,
            settings.googleClientSecret,
            settings.googleRefreshToken
        );
    }

    async uploadFile(
        userId: string,
        dataBuffer: Buffer,
        filename: string,
        mimeType: string,
        { folderId }: CreateGoogleDriveFileDto
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId 
            } 
        });
        const drive = await this._getInstance(user.subdomainId);
        return createFile(
            drive,
            filename,
            Readable.from(dataBuffer),
            mimeType,
            folderId
        );
    }
}
