import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Req,
    Param,
    Delete,
    UseGuards,} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('tags')
@Controller('tags')
@ApiHeader(SubdomainHeader)
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

  @ApiResponse({
      status: 200,
      description: 'Create tag',
  })
  @ApiBearerAuth()
  @UseGuards(
      JwtAuthGuard
      // , RolesGuard
  )
  // @Roles(Role.SUPER_ADMIN)
  @Post()
    create(@Req() req: any, @Body() createTagDto: CreateTagDto) {
        return this.tagsService.create(req.subdomainId, req.user.id, createTagDto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all tags',
  })
  @Get()
  findAll(@Req() req: any) {
      return this.tagsService.findAll(req.subdomainId);
  }

  @ApiResponse({
      status: 200,
      description: 'Get tag by id',
  })
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
      return this.tagsService.findOne(req.subdomainId, +id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update tag by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
      return this.tagsService.update(req.user.id, +id, updateTagDto);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete tag by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
      return this.tagsService.remove(req.user.id, +id);
  }
}
