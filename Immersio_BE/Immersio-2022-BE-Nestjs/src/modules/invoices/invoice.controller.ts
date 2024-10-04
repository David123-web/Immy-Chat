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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { query } from 'express';
import { SearchParamsDto } from '../../common/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('invoices')
@Controller('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Get()
    @Roles(Role.SUPER_ADMIN)
    findAll(@Query() query: SearchParamsDto) {
        return this.invoiceService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.invoiceService.findOne(id);
    }


}
