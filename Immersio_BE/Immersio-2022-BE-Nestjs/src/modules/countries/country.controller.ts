import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,} from '@nestjs/common';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('countries')
@Controller('countries')
@ApiHeader(SubdomainHeader)
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Create country',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Post()
    create(@Req() req: any, @Body() createCountryDto: CreateCountryDto) {
        return this.countryService.create(createCountryDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all countries',
    })
    @Get()
    findAll() {
        return this.countryService.findAll();
    }

    @ApiResponse({
        status: 200,
        description: 'Get details country by code',
    })
    @Get(':code')
    findOne(@Param('code') code: string) {
        return this.countryService.findOne(code);
    }

    @ApiResponse({
        status: 200,
        description: 'Update country by code',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch(':code')
    update(
        @Param('code') code: string,
        @Body() updateCountryDto: UpdateCountryDto
    ) {
        return this.countryService.update(code, updateCountryDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete country by code',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Delete(':code')
    remove(@Param('code') code: string) {
        return this.countryService.remove(code);
    }
}
