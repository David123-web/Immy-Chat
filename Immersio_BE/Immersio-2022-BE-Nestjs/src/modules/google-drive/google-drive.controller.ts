import {Controller,
    Get,
    Post,
    Res,
    Body,
    UseInterceptors,
    Patch,
    UploadedFile,
    StreamableFile,
    ParseFilePipe,
    Param,
    MaxFileSizeValidator,
    Delete,
    Query,} from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { CreateGoogleDriveDto } from './dto/create-google-drive.dto';
import { UpdateGoogleDriveDto } from './dto/update-google-drive.dto';
import {ApiBearerAuth,
    ApiConsumes,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CredentialGoogleDriveDto } from './dto/credential-google-drive.dto';
import { GetGoogleDriveFileDto } from './dto/get-google-drive-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from '../files/dto/upload-file.dto';
import { CreateGoogleDriveFileDto } from './dto/create-google-drive-file.dto';
import { MoveGoogleDriveFileDto } from './dto/move-google-drive-file.dto';
import { RenameGoogleDriveFileDto } from './dto/rename-google-drive-file.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('google-drive')
@Controller('google-drive')
@ApiHeader(SubdomainHeader)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GoogleDriveController {
    constructor(private readonly googleDriveService: GoogleDriveService) {}

  @ApiResponse({
      status: 200,
      description: 'Create credential',
  })
  @Post('credential')
    credential(@Req() req: any, @Body() dto: CredentialGoogleDriveDto) {
        return this.googleDriveService.credential(req.user.id, dto);
    }

  @ApiResponse({
      status: 200,
      description: 'Upload file',
  })
  @Post('files')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @Req() req: any,
    @UploadedFile(
        new ParseFilePipe({
            validators: [new MaxFileSizeValidator({
                maxSize: 5000000 
            })],
        })
    )
        file: Express.Multer.File,
    @Body() uploadFileDto: CreateGoogleDriveFileDto
  ) {
      return this.googleDriveService.uploadFile(
          req.user.id,
          file.buffer,
          file.originalname,
          file.mimetype,
          uploadFileDto
      );
  }

  @ApiResponse({
      status: 200,
      description: 'Get all files',
  })
  @Get('files')
  findAllFiles(@Req() req: any, @Query() dto: GetGoogleDriveFileDto) {
      return this.googleDriveService.findAllFiles(req.user.id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get all folders',
  })
  @Get('folders')
  findAllFolders(@Req() req: any, @Query() dto: GetGoogleDriveFileDto) {
      return this.googleDriveService.findAllFolders(req.user.id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Download file',
  })
  @Get('download/:id')
  async findOne(
    @Res({
        passthrough: true 
    }) res,
    @Req() req: any,
    @Param('id') id: string
  ) {
      const result = await this.googleDriveService.download(res, req.user.id, id);
      res.set({
          'Content-Disposition': `attachment; filename=${result[0]}` 
      });
      return new StreamableFile(result[1].data);
  }

  @ApiResponse({
      status: 200,
      description: 'Move file',
  })
  @Patch('move/:id')
  moveFile(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: MoveGoogleDriveFileDto
  ) {
      return this.googleDriveService.move(req.user.id, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Rename file',
  })
  @Patch('rename/:id')
  renameFile(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: RenameGoogleDriveFileDto
  ) {
      return this.googleDriveService.rename(req.user.id, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete file',
  })
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
      return this.googleDriveService.remove(req.user.id, id);
  }
}
