import {Req,
    Query,
    Body,
    Post,
    Get,
    Patch,
    Param,
    Delete,
    Controller,
    UseGuards,} from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCampusDto } from './dto/create-campus.dto';
import { PaginationSortDto } from 'src/common/dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { CampusRoomService } from './campus-rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomByIdDto } from './dto/get-room-by-id.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('campuses')
@ApiTags('campuses')
export class CampusesController {
    constructor(
        private readonly campusesService: CampusesService,
        private readonly campusRoomService: CampusRoomService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Create campus',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Post()
    create(@Req() req: any, @Body() dto: CreateCampusDto) {
        return this.campusesService.create(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Create room',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Post('rooms')
    createRoom(@Req() req: any, @Body() dto: CreateRoomDto) {
        return this.campusRoomService.create(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Update room',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Patch('room/:id')
    updateRoom(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateRoomDto
    ) {
        return this.campusRoomService.update(req.subdomainId, id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all rooms',
    })
    @Get('rooms')
    findAllRooms(@Req() req: any, @Query() dto: PaginationSortDto) {
        return this.campusRoomService.findAll(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all campuses',
    })
    @Get()
    findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
        return this.campusesService.findAll(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get detail campus',
    })
    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.campusesService.findOne(req.subdomainId, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Restore campus by id',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Patch(':id/restore')
    restore(@Req() req: any, @Param('id') id: string) {
        return this.campusesService.restore(req.subdomainId, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update campus detail by id',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateCampusDto
    ) {
        return this.campusesService.update(req.subdomainId, id, dto);
    }

    @ApiResponse({
        description: 'Get room by id',
    })
    @Get('room/:id')
    getRoomById(
        @Req() req: any,
        @Param('id') id: string,
        @Query() query: GetRoomByIdDto
    ) {
        return this.campusRoomService.findOne(
            req.subdomainId,
            id,
            query.start,
            query.end
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Remove campus by id',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Delete('rooms/:id')
    removeRoom(@Req() req: any, @Param('id') id: string) {
        return this.campusRoomService.remove(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Permanently remove campus by id',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Delete(':id/permanent')
    permanetRemove(@Req() req: any, @Param('id') id: string) {
        return this.campusesService.permanentRemove(req.subdomainId, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Remove campus by id',
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.campusesService.remove(req.subdomainId, id);
    }
}
