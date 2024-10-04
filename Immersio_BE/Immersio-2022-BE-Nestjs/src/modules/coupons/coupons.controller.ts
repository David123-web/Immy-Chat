import { Controller, Get, Query, Req, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationSortDto } from 'src/common/dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @ApiResponse({
        status: 200,
        description: 'Create coupon',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN)
    @Post()
    create(@Req() req: any, @Body() dto: CreateCouponDto) {
        return this.couponsService.create(req.subdomainId, req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all published coupons',
    })
    @ApiHeader(SubdomainHeader)
    @Get('public')
    findAllPublic(@Req() req: any, @Query() dto: PaginationSortDto) {
        return this.couponsService.findAllPublic(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all coupons',
    })
    @ApiHeader(SubdomainHeader)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Get()
    findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
        return this.couponsService.findAll(req.subdomainId, req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get detail coupon',
    })
    @ApiHeader(SubdomainHeader)
    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.couponsService.findOne(req.subdomainId, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Restore coupon by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch(':id/restore')
    restore(@Req() req: any, @Param('id') id: string) {
        return this.couponsService.restore(req.subdomainId, req.user.id, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update coupon detail by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateCouponDto
    ) {
        return this.couponsService.update(req.subdomainId, req.user.id, id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Permanently remove coupon by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Delete(':id/permanent')
    permanentRemove(@Req() req: any, @Param('id') id: string) {
        return this.couponsService.permanentRemove(req.subdomainId, req.user.id, id);
    }

    @ApiResponse({
        status: 200,
        description: 'Remove coupon by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.couponsService.remove(req.subdomainId, req.user.id, id);
    }
}
