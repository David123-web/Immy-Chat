import {Controller,
    Get,
    Body,
    Patch,
    UseGuards,} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SetRootSettingsDto } from './dto/set-root-settings.dto';
import { RootSettingsService } from './root-settings.service';

@ApiTags('root-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('root-settings')
export class RootSettingsController {
    constructor(private readonly rootSettingsService: RootSettingsService) { }

    @ApiResponse({
        status: 200,
        description: 'Get all settings',
    })
    @Get()
    @Roles(Role.SUPER_ADMIN)
    findAll() {
        return this.rootSettingsService.findAll();
    }

    @ApiResponse({
        status: 200,
        description: 'Update setting',
    })
    @Patch()
    @Roles(Role.SUPER_ADMIN)
    update(@Body() setRootSettings: SetRootSettingsDto) {
        return this.rootSettingsService.update(setRootSettings);
    }
}
