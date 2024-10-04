import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('languages')
@Controller('languages')
@ApiHeader(SubdomainHeader)
export class LanguageController {
    constructor(private readonly languageService: LanguageService) {}

  @ApiResponse({
      status: 200,
      description: 'Create language',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Post()
    create(@Req() req: any, @Body() createLanguageDto: CreateLanguageDto) {
        return this.languageService.create(createLanguageDto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all languages',
  })
  @Get()
  findAll() {
      return this.languageService.findAll();
  }

  @ApiResponse({
      status: 200,
      description: 'Get language by code',
  })
  @Get(':code')
  findOne(@Param('code') code: string) {
      return this.languageService.findOne(code);
  }

  @ApiResponse({
      status: 200,
      description: 'Update language',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateLanguageDto: UpdateLanguageDto
  ) {
      return this.languageService.update(code, updateLanguageDto);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete language',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Delete(':code')
  remove(@Param('code') code: string) {
      return this.languageService.remove(code);
  }
}
