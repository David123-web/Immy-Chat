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
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CourseLanguagesService } from './course-languages.service';
import { CreateCourseLanguageDto } from './dto/create-course-language.dto';
import { UpdateCourseLanguageDto } from './dto/update-course-language.dto';
import { GetLanguagesHasCourseDto } from './dto/get-languages-has-course.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('course-languages')
@Controller('course-languages')
@ApiHeader(SubdomainHeader)
export class CourseLanguagesController {
    constructor(
        private readonly courseLanguagesService: CourseLanguagesService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Create course language',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createCourseLanguageDto: CreateCourseLanguageDto) {
        return this.courseLanguagesService.create(createCourseLanguageDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all course languages',
    })
    @Get()
    findAll() {
        return this.courseLanguagesService.findAll();
    }

    @ApiResponse({
        status: 200,
        description: 'Get all course languages',
    })

    @ApiResponse({
        status: 200,
        description: 'Get details course language by code',
    })
    @Get('/languagesHasCourse')
    getLanguagesHasCourse(
        @Req() req: any,
        @Query() query: GetLanguagesHasCourseDto
    ) {
        const subdomainId = req.subdomainId;
        return this.courseLanguagesService.getLanguagesHasCourse(
            subdomainId,
            query.isFree
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get details course language by id',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.courseLanguagesService.findOne(+id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update course language by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCourseLanguageDto: UpdateCourseLanguageDto
    ) {
        return this.courseLanguagesService.update(+id, updateCourseLanguageDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete course language by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.courseLanguagesService.remove(+id);
    }
}
