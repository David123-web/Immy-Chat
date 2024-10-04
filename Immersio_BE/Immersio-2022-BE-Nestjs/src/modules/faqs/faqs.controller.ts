import { Controller, Get, Query, Req, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FAQsService } from './faqs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFAQCategoryDto } from './dto/create-faq-category.dto';
import { FAQCategoriesService } from './faqs-categories.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationSortDto } from 'src/common/dto';
import { UpdateFAQCategoryDto } from './dto/update-faq-category.dto';
import { CreateFAQDto } from './dto/create-faq.dto';
import { UpdateFAQDto } from './dto/update-faq.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('faqs')
@Controller('faqs')
export class FAQsController {
    constructor(private readonly faqsService: FAQsService, private readonly faqCategoriesService: FAQCategoriesService) { }

  //Categories
  @ApiResponse({
      status: 200,
      description: 'Create faq category',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Post('categories')
    createCategory(@Req() req: any, @Body() dto: CreateFAQCategoryDto) {
        return this.faqCategoriesService.create(req.subdomainId, dto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all faq categories',
  })
  @ApiHeader(SubdomainHeader)
  @Get('categories')
  findAllCategories(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.faqCategoriesService.findAll(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get detail faq category',
  })
  @ApiHeader(SubdomainHeader)
  @Get('categories/:id')
  findOneCategory(@Req() req: any, @Param('id') id: string) {
      return this.faqCategoriesService.findOne(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Restore faq category by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch('categories/:id/restore')
  restoreCategory(@Req() req: any, @Param('id') id: string) {
      return this.faqCategoriesService.restore(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update faq category detail by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch('categories/:id')
  updateCategory(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFAQCategoryDto
  ) {
      return this.faqCategoriesService.update(req.subdomainId, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Permanently remove faq category by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete('categories/:id/permanent')
  permanentRemoveCategory(@Req() req: any, @Param('id') id: string) {
      return this.faqCategoriesService.permanentRemove(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Remove faq category by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete('categories/:id')
  removeCategory(@Req() req: any, @Param('id') id: string) {
      return this.faqCategoriesService.remove(req.subdomainId, id);
  }

  //FAQs
  @ApiResponse({
      status: 200,
      description: 'Create faq',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Post()
  create(@Req() req: any, @Body() dto: CreateFAQDto) {
      return this.faqsService.create(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get all faqs',
  })
  @ApiHeader(SubdomainHeader)
  @Get()
  findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.faqsService.findAll(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get detail faq',
  })
  @ApiHeader(SubdomainHeader)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
      return this.faqsService.findOne(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Restore faq by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch(':id/restore')
  restore(@Req() req: any, @Param('id') id: string) {
      return this.faqsService.restore(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update faq detail by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFAQDto
  ) {
      return this.faqsService.update(req.subdomainId, id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Permanently remove faq by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete(':id/permanent')
  permanentRemove(@Req() req: any, @Param('id') id: string) {
      return this.faqsService.permanentRemove(req.subdomainId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Remove faq by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUBDOMAIN_ADMIN)
  @Delete(':id')
  permanent(@Req() req: any, @Param('id') id: string) {
      return this.faqsService.remove(req.subdomainId, id);
  }
}
