import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('levels')
@Controller('levels')
@ApiHeader(SubdomainHeader)
export class LevelsController {
    constructor(private readonly levelsService: LevelsService) {}

  @ApiResponse({
      status: 200,
      description: 'Create level',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
    create(@Req() req: any, @Body() createLevelDto: CreateLevelDto) {
        return this.levelsService.create(req.user.id, createLevelDto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all levels',
  })
  @Get()
  findAll() {
      return this.levelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.levelsService.findOne(+id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update level',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
      return this.levelsService.update(+id, updateLevelDto);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete level',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.levelsService.remove(+id);
  }
}
