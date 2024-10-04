import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Req,
    UseGuards,} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PushNotificationDto } from './dto/push-notification.dto';
import { RegisterNotificationTokenDto } from './dto/register-notification-token.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader(SubdomainHeader)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @ApiResponse({
        status: 200,
        description: 'Create notification',
    })
    @Post()
    create(
        @Req() req: any,
        @Body() createNotificationDto: CreateNotificationDto,
    ) {
        return this.notificationsService.create(
            req.user.id,
            createNotificationDto,
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Register notification token',
    })
    @Post('register')
    registerToken(@Req() req: any, @Body() dto: RegisterNotificationTokenDto) {
        return this.notificationsService.registerToken(req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all notifications',
    })
    @Get()
    findAll(@Req() req: any, @Query() dto: PaginationDto<string>) {
        return this.notificationsService.findAll(req.user.id, dto);
    }
    
    @ApiResponse({
        status: 200,
        description: 'Get notification by id',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationsService.findOne(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Seen notification',
    })
    @Patch('')
    seen(@Req() req: any, @Body() ids: string[]) {
        return this.notificationsService.seen(req.user.id, ids);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete notification',
    })
    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.notificationsService.remove(req.user.id, id);
    }
}
