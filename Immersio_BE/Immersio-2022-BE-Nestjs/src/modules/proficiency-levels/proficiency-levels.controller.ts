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
import { ProficiencyLevelsService } from './proficiency-levels.service';
import {  CreateProficiencyLevelDto } from './dto/create-proficiency-level.dto';
import { UpdateProficiencyLevelDto } from './dto/update-proficiency-level.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('proficiency-levels')
@Controller('proficiency-levels')
@ApiHeader(SubdomainHeader)
export class ProficiencyLevelsController {
    constructor(private readonly proficiencyLevelsService: ProficiencyLevelsService) {}

  @ApiResponse({
      status: 201,
      description: 'Create proficiency level',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Post()
    create(@Req() req: any, @Body() createProficiencyLevelDto: CreateProficiencyLevelDto) {
        return this.proficiencyLevelsService.create(createProficiencyLevelDto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all proficiency levels',
  })
  @Get()
  findAll() {
      return this.proficiencyLevelsService.findAll();
  }

  @ApiResponse({
      status: 200,
      description: 'Get proficiency level by code',
  })
  @Get(':code')
  findOne(@Param('code') code: string) {
      return this.proficiencyLevelsService.findOne(code);
  }

  @ApiResponse({
      status: 200,
      description: 'Update proficiency level',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateProficiencyLevelDto: UpdateProficiencyLevelDto
  ) {
      return this.proficiencyLevelsService.update(code, updateProficiencyLevelDto);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete proficiency level',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  @Delete(':code')
  remove(@Param('code') code: string) {
      return this.proficiencyLevelsService.remove(code);
  }
}
