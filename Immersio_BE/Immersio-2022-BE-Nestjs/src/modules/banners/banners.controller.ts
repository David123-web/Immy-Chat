import { Controller, Get, Query, Req, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationSortDto } from 'src/common/dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('banners')
@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) { }

  @ApiResponse({
      status: 200,
      description: 'Create banner',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Post()
    create(@Req() req: any, @Body() dto: CreateBannerDto) {
        return this.bannersService.create(req.subdomainId, dto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all banners',
  })
  @ApiHeader(SubdomainHeader)
  @Get()
  findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.bannersService.findAll(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get detail banner',
  })
  @ApiHeader(SubdomainHeader)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
      return this.bannersService.findOne(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Restore banner by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch(':id/restore')
  restore(@Req() req: any, @Param('id') id: string) {
      return this.bannersService.restore(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update banner detail by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto
  ) {
      return this.bannersService.update(req.subdomainId, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Permanently remove banner by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete(':id/permanent')
  permanentRemove(@Req() req: any, @Param('id') id: string) {
      return this.bannersService.permanentRemove(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Remove banner by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete(':id')
  permanent(@Req() req: any, @Param('id') id: string) {
      return this.bannersService.remove(req.subdomainId, id);
  }
}
