import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import CreateVocabularyDto from './dto/create-vocabulary.dto';
import UpdateVocabularyDto from './dto/update-vocabulary.dto';
import { ApiHeader, ApiBearerAuth, ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { FindVocabularyDto } from './dto/find-vocabulary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';
import { BasicAuthGuard } from '../auth/basic-auth.guard';

@ApiTags('vocabularies')
@Controller('vocabularies')
@ApiHeader(SubdomainHeader)
export class VocabulariesController {
    constructor(private readonly vocabulariesService: VocabulariesService) { }
    
    @ApiResponse({
        status: 200,
        description: 'Creates a new vocabulary.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    create(@Req() req: any, @Body() createVocabularyDto: CreateVocabularyDto) {
        return this.vocabulariesService.create(createVocabularyDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all vocabularies.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    findAll(@Query() dto: FindVocabularyDto) {
        return this.vocabulariesService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all vocabularies for Immy.'
    })
    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @Get("immy")
    findAllImmy(@Query() dto: FindVocabularyDto) {
        return this.vocabulariesService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all vocabularies for public.'
    })
    @Get('public')
    findAllPublic(@Query() dto: FindVocabularyDto) {
        return this.vocabulariesService.findAllPublic(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get details of vocabulary by id.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    findOne(@Param('id') id: string) {
        return this.vocabulariesService.findOneById(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update details of vocabulary by id.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    update(@Param('id') id: string, @Body() updateVocabularyDto: UpdateVocabularyDto) {
        return this.vocabulariesService.update(id, updateVocabularyDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete vocabulary by id.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    remove(@Param('id') id: string) {
        return this.vocabulariesService.remove(id);
    }
}
