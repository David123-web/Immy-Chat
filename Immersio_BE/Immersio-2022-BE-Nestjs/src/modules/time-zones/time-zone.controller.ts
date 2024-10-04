import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TimeZoneService } from './time-zone.service';

@ApiTags('timezones')
@Controller('timezones')
export class TimeZoneController {
    constructor(private readonly timeZoneService: TimeZoneService) {}

    @ApiResponse({
        status: 200,
        description: 'Get all timezones',
    })
    @Get()
    findAll() {
        return this.timeZoneService.findAll();
    }
}
