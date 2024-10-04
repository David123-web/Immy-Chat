import { Controller, Get, Query, Req, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { BlogCategoriesService } from './blog-categories.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationSortDto } from 'src/common/dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService, private readonly blogCategoriesService: BlogCategoriesService) { }

  //Categories
  @ApiResponse({
      status: 200,
      description: 'Create blog category',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Post('categories')
    createCategory(@Req() req: any, @Body() dto: CreateBlogCategoryDto) {
        return this.blogCategoriesService.create(req.subdomainId, dto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all blog categories',
  })
  @ApiHeader(SubdomainHeader)
  @Get('categories')
  findAllCategories(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.blogCategoriesService.findAll(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get detail blog category',
  })
  @ApiHeader(SubdomainHeader)
  @Get('categories/:id')
  findOneCategory(@Req() req: any, @Param('id') id: string) {
      return this.blogCategoriesService.findOne(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Restore blog category by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch('categories/:id/restore')
  restoreCategory(@Req() req: any, @Param('id') id: string) {
      return this.blogCategoriesService.restore(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update blog category detail by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch('categories/:id')
  updateCategory(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryDto
  ) {
      return this.blogCategoriesService.update(req.subdomainId, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Permanently remove blog category by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete('categories/:id/permanent')
  permanentRemoveCategory(@Req() req: any, @Param('id') id: string) {
      return this.blogCategoriesService.permanentRemove(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Remove blog category by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete('categories/:id')
  removeCategory(@Req() req: any, @Param('id') id: string) {
      return this.blogCategoriesService.remove(req.subdomainId, id);
  }

  //Blogs
  @ApiResponse({
      status: 200,
      description: 'Create blog',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Post()
  create(@Req() req: any, @Body() dto: CreateBlogDto) {
      return this.blogsService.create(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get all published blogs',
  })
  @ApiHeader(SubdomainHeader)
  @Get()
  findAllPublic(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.blogsService.findAllPublic(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get all blogs',
  })
  @ApiHeader(SubdomainHeader)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Get()
  findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.blogsService.findAll(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get detail blog',
  })
  @ApiHeader(SubdomainHeader)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
      return this.blogsService.findOne(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Restore blog by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch(':id/restore')
  restore(@Req() req: any, @Param('id') id: string) {
      return this.blogsService.restore(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update blog detail by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto
  ) {
      return this.blogsService.update(req.subdomainId, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Permanently remove blog by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete(':id/permanent')
  permanentRemove(@Req() req: any, @Param('id') id: string) {
      return this.blogsService.permanentRemove(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Remove blog by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete(':id')
  permanent(@Req() req: any, @Param('id') id: string) {
      return this.blogsService.remove(req.subdomainId, id);
  }
}
