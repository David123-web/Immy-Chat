import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Res,
    Delete,
    UseGuards,
    Query,
    Req,
    StreamableFile,
    Put,} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RenameFolderDto } from './dto/rename-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';
import { GetListFoldersDto } from './dto/get-list-folders.dto';
import { MoveFolderDto } from './dto/move-folder.dto';
import { GetCountFoldersDto } from './dto/get-count-folders';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('folders')
@Controller('drive/folders')
@ApiHeader(SubdomainHeader)
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

  @ApiResponse({
      status: 200,
      description: 'Create folder',
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
    create(@Req() req: any, @Body() createFolderDto: CreateFolderDto) {
        return this.foldersService.create(req.user.id, createFolderDto);
    }

  @ApiResponse({
      status: 200,
      description: 'Count folders',
  })
  @Get('count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  count(@Req() req: any, @Query() query: GetCountFoldersDto) {
      return this.foldersService.count(req.user.id, query);
  }

  @ApiResponse({
      status: 200,
      description: 'Get all folders',
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any, @Query() query: GetListFoldersDto) {
      return this.foldersService.findAll(req.user.id, query);
  }

  @ApiResponse({
      status: 200,
      description: 'Download folder',
  })
  @Get('download/:id')
  async download(@Param('id') id: string, @Res({
      passthrough: true 
  }) res) {
      // const { name, stream } = await this.foldersService.download(id);
      // res.set({ "Content-Disposition": `attachment; filename=${name}` });
      // return new StreamableFile(stream);
  }

  @ApiResponse({
      status: 200,
      description: 'Get folder by id',
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any, @Param('id') id: string) {
      return this.foldersService.findOne(req.user.id, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update folder',
  })
  @Patch('name/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  rename(
    @Req() req: any,
    @Param('id') id: string,
    @Body() { name }: RenameFolderDto
  ) {
      return this.foldersService.rename(req.user.id, id, name);
  }

  @ApiResponse({
      status: 200,
      description: 'Move folder',
  })
  @Patch('move/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  move(
    @Req() req: any,
    @Param('id') id: string,
    @Body() { parentFolderId }: MoveFolderDto
  ) {
      return this.foldersService.move(req.user.id, id, parentFolderId);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete folder',
  })
  @Put('delete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any, @Body() { ids }: DeleteFoldersDto) {
      return this.foldersService.delete(req.user.id, ids);
  }
}
