import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,} from '@nestjs/common';
import { AvailableTimeService } from './available-time.service';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { GetAvailableTimeDto } from './dto/get-available-time.dto';

@ApiTags('available-time')
@Controller('available-time')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
export class AvailableTimeController {
    constructor(private readonly availableTimeService: AvailableTimeService) {}

    @Post()
    create(
        @Req() req: any,
        @Body() createAvailableTimeDto: CreateAvailableTimeDto
    ) {
        const creatorId = req.user.id;

        return this.availableTimeService.create(
            creatorId,
            createAvailableTimeDto
        );
    }

    @Get()
    findAll(@Query() query: GetAvailableTimeDto) {
        return this.availableTimeService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.availableTimeService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAvailableTimeDto: UpdateAvailableTimeDto
    ) {
        return this.availableTimeService.update(+id, updateAvailableTimeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.availableTimeService.remove(+id);
    }
}
