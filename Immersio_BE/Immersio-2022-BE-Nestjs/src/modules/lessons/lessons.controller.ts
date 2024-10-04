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
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import FindLessonDto from './dto/find-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { SubdomainHeader } from 'src/helpers/common';
import CheckLessonProgressDto from './dto/check-lesson-progress';

@ApiTags('lessons')
@Controller('lessons')
@ApiHeader(SubdomainHeader)
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @ApiResponse({
        status: 200,
        description: 'Create lesson',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req: any, @Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(
            req.subdomainId,
            req.user.id,
            createLessonDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Check lesson progress',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('progresses')
    checkProgress(@Req() req: any, @Body() dto: CheckLessonProgressDto) {
        return this.lessonsService.checkProgress(
            req.subdomainId,
            req.user.id,
            dto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Delete lesson progress',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id/progresses')
    deleteProgress(@Req() req: any, @Param('id') id: number) {
        return this.lessonsService.resetProgress(
            req.subdomainId,
            req.user.id,
            id
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get all lessons',
    })
    @Get()
    findAll(@Req() req: any, @Query() dto: FindLessonDto) {
        return this.lessonsService.findAll(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get lesson by id',
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.lessonsService.findOne(req.user.id, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update lesson',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(+id, updateLessonDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete lesson',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.lessonsService.remove(+id);
    }
}
