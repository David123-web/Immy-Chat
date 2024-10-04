import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,} from '@nestjs/common';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DrillsService } from './drills.service';
import { CreateDrillDto } from './dto/create-drill.dto';
import { FindDrillDto } from './dto/find-drill.dto';
import { UpdateDrillDto } from './dto/update-drill.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('drills')
@Controller('drills')
@ApiHeader(SubdomainHeader)
export class DrillsController {
    constructor(private readonly drillsService: DrillsService) {}

    @ApiResponse({
        status: 200,
        description: 'Create drill',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    create(@Body() createDrillDto: CreateDrillDto) {
        return this.drillsService.create(createDrillDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all drills',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    findAll(@Query() dto: FindDrillDto) {
        return this.drillsService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all drills public',
    })
    @Get('public')
    findAllPublic(@Query() dto: FindDrillDto) {
        return this.drillsService.findAllPublic(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get details drill by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    findOne(@Param('id') id: string) {
        return this.drillsService.findOne(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update details drill by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    update(@Param('id') id: string, @Body() updateDrillDto: UpdateDrillDto) {
        return this.drillsService.update(id, updateDrillDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Remove drill by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    remove(@Param('id') id: string) {
        return this.drillsService.remove(id);
    }
}
