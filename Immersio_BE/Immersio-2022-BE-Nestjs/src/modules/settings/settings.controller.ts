import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { FindSettingsDto } from './dto/find-settings.dto';
import { Req } from '@nestjs/common/decorators';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('settings')
@ApiHeader(SubdomainHeader)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @ApiResponse({
        status: 200,
        description: 'Create setting',
    })
    @Post()
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    create(@Req() req: any, @Body() createSettingDto: CreateSettingDto) {
        return this.settingsService.create(req.user.id, createSettingDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all settings',
    })
    @Get()
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    findAll(@Query() { subdomainId }: FindSettingsDto) {
        return this.settingsService.findAll(subdomainId);
    }

    @ApiResponse({
        status: 200,
        description: 'Get setting by id',
    })
    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    findOne(@Param('id') id: string) {
        return this.settingsService.findOne(+id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update setting by id',
    })
    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    update(@Req() req: any, @Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.update(req.user.id, +id, updateSettingDto);
    }
}
