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
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import FindSectionDto from './dto/find-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('sections')
@Controller('sections')
@ApiHeader(SubdomainHeader)
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService) {}

    @ApiResponse({
        status: 200,
        description: 'Create section',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req: any, @Body() createSectionDto: CreateSectionDto) {
        return this.sectionsService.create(req.user.id, createSectionDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all sections',
    })
    @Get()
    findAll(@Query() dto: FindSectionDto) {
        return this.sectionsService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get section by id',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sectionsService.findOne(+id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update section',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSectionDto: UpdateSectionDto
    ) {
        return this.sectionsService.update(+id, updateSectionDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete section',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sectionsService.remove(+id);
    }
}
