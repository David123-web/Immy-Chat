import { Controller, Get, Query } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindLogsDto } from './dto/find-logs.dto';
import { LogsService } from './logs.service';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('logs')
@Controller('logs')
@ApiHeader(SubdomainHeader)
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

  @ApiResponse({
      status: 200,
      description: 'Get all logs.',
  })
  @Get()
    findAll(@Query() data: FindLogsDto) {
        return this.logsService.findAll(data);
    }
}
