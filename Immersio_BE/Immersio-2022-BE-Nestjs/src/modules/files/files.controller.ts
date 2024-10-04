import {Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Delete,
    Res,
    Param,
    StreamableFile,
    Req,
    Patch,
    Query,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    Put,} from '@nestjs/common';
import { FilesService } from './files.service';
import {ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetListFilesDto } from './dto/get-list-files.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { DeleteFilesDeto } from './dto/delete-files.dto';
import { RenameFileDto } from './dto/rename-file.dto';
import { MoveFileDto } from './dto/move-file.dto';
import { PublicFileDto } from './dto/public-file.dto';
import { SendShareEmailDto } from './dto/send-share-email';
import { DownloadFilesDto } from './dto/dowload-files.dto';
import { v4 as uuidv4 } from 'uuid';
import { AddExternalFileDto } from './dto/add-external-file.dto';
import { ChangeExternalFileLinkDto } from './dto/change-external-file-link.dto';
import { GetCountFilesDto } from './dto/get-count-files';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('files')
@Controller('drive/files')
@ApiHeader(SubdomainHeader)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiResponse({
        description:
            'Async function that uploads a file to AWS S3 and creates a new file entry in the database.',
        status: 200,
    })
    @ApiConsumes('multipart/form-data')
    async uploadFile(
        @Req() req: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 20000000,
                    }),
                ],
            })
        )
            file: Express.Multer.File,
        @Body() uploadFileDto: UploadFileDto
    ) {
        return this.filesService.uploadFile(
            req.user.id,
            file.buffer,
            file.originalname,
            uploadFileDto
        );
    }

    @Post('external')
    @ApiBearerAuth()
    @ApiResponse({
        description: 'Adds an external file to the user\'s account.',
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    async add(@Req() req: any, @Body() dto: AddExternalFileDto) {
        return this.filesService.addExternalFile(req.user.id, dto);
    }

    @Patch('external/:id')
    @ApiBearerAuth()
    @ApiResponse({
        description:
            'Updates the external link of a file given its ID. Throws a ForbiddenException if the user ID does not match the ID of the file\'s owner',
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    async changeExternalLink(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: ChangeExternalFileLinkDto
    ) {
        return this.filesService.changeExternalLink(req.user.id, id, dto);
    }

    @Post('send-share-email')
    @ApiBearerAuth()
    @ApiResponse({
        description:
            'Sends an email with a share link to the specified email address for the given file ID.',
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    sendShareEmail(@Req() req: any, @Body() dto: SendShareEmailDto) {
        return this.filesService.sendShareEmail(req.user.id, dto);
    }

    @Get('count')
    @ApiBearerAuth()
    @ApiResponse({
        description: 'Returns the number of files in the database.',
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    count(@Req() req: any, @Query() query: GetCountFilesDto) {
        return this.filesService.count(req.user.id, query);
    }

    @Get()
    @ApiBearerAuth()
    @ApiResponse({
        description: 'Returns all files in the database.',
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: any, @Query() query: GetListFilesDto) {
        return this.filesService.findAll(req.user.id, query);
    }

    @Get('public/download/:token')
    @ApiResponse({
        status: 200,
        description: 'Downloads a public file by token from S3 bucket.',
    })
    async publicDownload(
        @Param('token') token: string,
        @Res({
            passthrough: true,
        })
            res
    ) {
        const { name, stream } = await this.filesService.publicDownload(token);
        console.log(name);
        res.set({
            'Content-Disposition': `attachment; filename=${name}`,
        });
        return new StreamableFile(stream);
    }

    @Get('download/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Downloads a file by ID from S3 bucket.',
    })
    @UseGuards(JwtAuthGuard)
    async download(
        @Param('id') id: string,
        @Res({
            passthrough: true,
        })
            res,
        @Req() req: any
    ) {
        const { name, stream } = await this.filesService.download(
            req.user.id,
            id
        );
        console.log(name);
        res.set({
            'Content-Disposition': `attachment; filename=${name}`,
        });
        return new StreamableFile(stream);
    }

    @Post('download')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Downloads multiple files from S3 bucket.',
    })
    @UseGuards(JwtAuthGuard)
    async downloadMultiples(
        @Body() { ids }: DownloadFilesDto,
        @Res() res,
        @Req() req: any
    ) {
        const mfStream = await this.filesService.downloadMultiples(
            req.user.id,
            ids
        );
        console.log(mfStream);
        res.set({
            'Content-Disposition': `attachment; filename=${uuidv4()}.zip`,
        });
        mfStream.pipe(res);
        mfStream.finalize();
    }

    @Get('link/public/:id')
    @ApiResponse({
        status: 200,
        description: 'Returns a public link for a file.',
    })
    async linkPublic(@Req() req: any, @Param('id') id: string) {
        return this.filesService.getOneTimeLinkPublic(id);
    }

    @Get('link/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Returns a link for a file based on Id.',
    })
    @UseGuards(JwtAuthGuard)
    async link(@Req() req: any, @Param('id') id: string) {
        return this.filesService.getOneTimeLink(req.user.id, id);
    }

    @Get('thumbnail/:id')
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Returns a thumbnail for a file based on Id.',
    })
    async getDirectThumbnail(@Req() req: any, @Param('id') id: string) {
        return this.filesService.getThumbnailFromThumbnailId(req.user?.id, id);
    }

    @Get(':id/thumbnail')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Returns a thumbnail for a file based on Id.',
    })
    @UseGuards(JwtAuthGuard)
    async getThumbnail(@Req() req: any, @Param('id') id: string) {
        return this.filesService.getThumbnail(req.user.id, id);
    }
    

    @Get('public/:id')
    @ApiResponse({
        status: 200,
        description: 'Returns a file based on Id.',
    })
    findOnePublic(@Param('id') id: string) {
        return this.filesService.findOnePublic(id);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Returns a file based on Id.',
    })
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(id);
    }

    @Patch('name/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Renames a file based on Id.',
    })
    @UseGuards(JwtAuthGuard)
    rename(
        @Req() req: any,
        @Param('id') id: string,
        @Body() { name }: RenameFileDto
    ) {
        return this.filesService.rename(req.user.id, id, name);
    }

    @Patch('move/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Moves a file based on Id.',
    })
    @UseGuards(JwtAuthGuard)
    move(
        @Req() req: any,
        @Param('id') id: string,
        @Body() { folderId }: MoveFileDto
    ) {
        return this.filesService.move(req.user.id, id, folderId);
    }

    @Patch('public/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Changes the public status of a file based on Id.',
    })
    public(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: PublicFileDto
    ) {
        return this.filesService.changePublicStatus(req.user.id, id, dto);
    }

    @Put('delete')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Deletes a file based on Id.',
    })
    @UseGuards(JwtAuthGuard)
    remove(@Req() req: any, @Body() { ids }: DeleteFilesDeto) {
        return this.filesService.delete(req.user.id, ids);
    }
}
