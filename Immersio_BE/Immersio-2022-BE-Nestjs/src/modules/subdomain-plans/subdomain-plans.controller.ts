import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SubdomainPlansService } from './subdomain-plans.service';
import { CreateSubdomainPlanDto } from './dto/create-subdomain-plan.dto';
import { UpdateSubdomainPlanDto } from './dto/update-subdomain-plan.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { PaginationSortDto } from 'src/common/dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RegisterSubdomainPlanDto } from './dto/register-subdomain-plan.dto';

@ApiTags('subdomain-plans')
@Controller('subdomain-plans')
export class SubdomainPlansController {
    constructor(private readonly subdomainPlansService: SubdomainPlansService) { }

    //Get plans
    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    findAll(@Query() dto: PaginationSortDto) {
        return this.subdomainPlansService.findAll(dto);
    }

    @Get('public')
    findDefault() {
        return this.subdomainPlansService.findDefault();
    }

    //Create plan
    @ApiResponse({
        status: 200,
        description: 'Create subdomain plan',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Post()
    create(@Body() dto: CreateSubdomainPlanDto) {
        return this.subdomainPlansService.create(dto);
    }

    //Update plan
    @ApiResponse({
        status: 200,
        description: 'Update subdomain plan',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateSubdomainPlanDto) {
        return this.subdomainPlansService.update(id, dto);
    }

    //Delete plan
    @ApiResponse({
        status: 200,
        description: 'Delete subdomain plan',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subdomainPlansService.remove(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Post('checkout')
    register(@Req() req: any) {
        return this.subdomainPlansService.checkout(req.subdomainId, req.user.id);
    }

    @ApiBearerAuth()
    @Post('checkout/success')
    checkoutSuccess(@Body() data: any) {
        return this.subdomainPlansService.successCheckout(data);
    }

    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.SUBDOMAIN_ADMIN)
    // @Post('subscribe')
    // createInvoice(@Req() req: any) {
    //     return this.subdomainPlansService.subscribe(req.subdomainId);
    // }
}