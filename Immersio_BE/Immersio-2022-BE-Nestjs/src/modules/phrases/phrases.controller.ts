import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { PhrasesService } from './phrases.service';
import CreatePhraseDto from './dto/create-phrase.dto';
import UpdatePhraseDto from './dto/update-phrase.dto';
import { ApiHeader, ApiBearerAuth, ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { FindPhraseDto } from './dto/find-phrase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';
import { BasicAuthGuard } from '../auth/basic-auth.guard';

@ApiTags('phrases')
@Controller('phrases')
@ApiHeader(SubdomainHeader)

export class PhrasesController {
    constructor(private readonly phrasesService: PhrasesService) { }

    @ApiResponse({
        status: 200,
        description: 'Create phrase',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    create(@Body() createPhraseDto: CreatePhraseDto) {
        return this.phrasesService.create(createPhraseDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all phrases',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    findAll(@Query() dto: FindPhraseDto) {
        return this.phrasesService.findAll(dto);
    }

    @ApiResponse({
        status : 200,
        description: 'Get all phrases by lessonId for immy',
    })
    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @Get('immy')
    findAllByLessonId(@Query() dto: FindPhraseDto) {
        return this.phrasesService.findAllByLessonDto(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all phrases for public',
    })
    @Get('public')
    findAllPublic(@Query() dto: FindPhraseDto) {
        return this.phrasesService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get phrase by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    findOne(@Param('id') id: string) {
        return this.phrasesService.findOneById(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update phrase',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    update(@Param('id') id: string, @Body() updatePhraseDto: UpdatePhraseDto) {
        return this.phrasesService.update(id, updatePhraseDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete phrase',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    remove(@Param('id') id: string) {
        return this.phrasesService.remove(id);
    }
}
