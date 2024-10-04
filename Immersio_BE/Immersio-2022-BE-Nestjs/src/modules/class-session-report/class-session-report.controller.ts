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
import { ClassSessionReportService } from './class-session-report.service';
import { CreateClassSessionReportDto } from './dto/create-class-session-report.dto';
import { UpdateClassSessionReportDto } from './dto/update-class-session-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import FindClassSessionReportDto from './dto/find-class-session-report.dto';

@Controller('class-session-report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('class-session-report')
//TODO: (trien) add roles validation
export class ClassSessionReportController {
    constructor(
        private readonly classSessionReportService: ClassSessionReportService
    ) {}

    @Post()
    create(
        @Req() req,
        @Body() createClassSessionReportDto: CreateClassSessionReportDto
    ) {
        return this.classSessionReportService.create(
            req.subdomainId,
            createClassSessionReportDto
        );
    }

    @Get()
    findAll(@Req() req, @Query() query: FindClassSessionReportDto) {
        return this.classSessionReportService.findAll(req.subdomainId, query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.classSessionReportService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateClassSessionReportDto: UpdateClassSessionReportDto
    ) {
        return this.classSessionReportService.update(
            +id,
            updateClassSessionReportDto
        );
    }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.classSessionReportService.remove(+id);
    // }
}
