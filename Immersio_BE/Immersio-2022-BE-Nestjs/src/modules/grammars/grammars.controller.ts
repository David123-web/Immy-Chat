import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { GrammarsService } from './grammars.service';
import CreateGrammarDto from './dto/create-grammar.dto';
import UpdateGrammarDto from './dto/update-grammar.dto';
import { ApiHeader, ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { FindGrammarDto } from './dto/find-grammar.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('grammars')
@Controller('grammars')
@ApiHeader(SubdomainHeader)
export class GrammarsController {
    constructor(private readonly grammarsService: GrammarsService) { }

    @ApiResponse({
        status: 200,
        description: 'Create grammar',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    create(@Body() CreateGrammarDto: CreateGrammarDto) {
        return this.grammarsService.create(CreateGrammarDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all grammars',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    findAll(@Query() dto: FindGrammarDto) {
        return this.grammarsService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all grammars for public',
    })
    @Get('public')
    findAllPublic(@Query() dto: FindGrammarDto) {
        return this.grammarsService.findAllPublic(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get grammar by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    findOne(@Param('id') id: string) {
        return this.grammarsService.findOneById(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update grammar',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    update(@Param('id') id: string, @Body() UpdateGrammarDto: UpdateGrammarDto) {
        return this.grammarsService.update(id, UpdateGrammarDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete grammar',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    remove(@Param('id') id: string) {
        return this.grammarsService.remove(id);
    }
}
