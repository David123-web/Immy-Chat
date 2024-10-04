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
import { VoiceRecordService } from './voice-record.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { GetListRecordsDto } from './dto/get-list-record.dto';
import { AddVoiceRecordDto } from './dto/add-voice-record.dto';

@ApiTags('voice-record')
@Controller('voice-record')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VoiceRecordController {
    constructor(private readonly voiceRecordService: VoiceRecordService) {}

    @ApiResponse({
        status: 200,
        description: 'Get list voice records',
    })
    @Get('records')
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.STUDENT)
    getListRecords(@Req() req: any, @Query() query: GetListRecordsDto) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.voiceRecordService.getListRecords(userId, role, query);
    }

    @ApiResponse({
        status: 200,
        description: 'Add voice record',
    })
    @Post('add-record')
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.STUDENT)
    addRecord(@Req() req: any, @Body() body: AddVoiceRecordDto) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.voiceRecordService.addRecord(userId, role, body);
    }

    @ApiResponse({
        status: 200,
        description: 'Get detail voice record',
    })
    @Get('detail/:id')
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.STUDENT)
    getDetailRecord(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        return this.voiceRecordService.getDetailRecord(userId, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete voice record',
    })
    @Delete(':id')
    @Roles(Role.TUTOR, Role.INSTRUCTOR, Role.STUDENT)
    deleteRecord(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        return this.voiceRecordService.deleteRecord(userId, id);
    }
}
