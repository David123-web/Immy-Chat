import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterSubdomainDto } from './dto/register-subdomain.dto';
import { VerifySubdomainDto } from './dto/verify-subdomain.dto';
import { SubdomainService } from './subdomain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { UpdateExpireTimeDto } from './dto/update-expire-time.dto';

@ApiTags('subdomain')
@Controller('subdomain')
export class SubdomainController {
    constructor(private readonly subdomainService: SubdomainService) { }

    @ApiResponse({
        status: 200,
        description: 'Get subdomain config by subdomain',
    })
    @Get('config/:subdomain')
    getSubdomainConfig(@Param('subdomain') subdomain: string) {
        return this.subdomainService.getSubdomainConfig(subdomain);
    }

    @ApiResponse({
        status: 200,
        description: 'Check subdomain if exists by subdomain',
    })
    @Get('check/:subdomain')
    checkSubdomain(@Param('subdomain') domainName: string) {
        return this.subdomainService.checkSubdomain(domainName);
    }

    @ApiResponse({
        status: 200,
        description: 'Register subdomain',
    })
    @Post('/register')
    registerSubdomain(@Body() body: RegisterSubdomainDto) {
        return this.subdomainService.registerSubdomain(body);
    }

    @ApiResponse({
        status: 200,
        description: 'Verify subdomain by token',
    })
    @Post('/verify')
    verifySubdomain(@Body() body: VerifySubdomainDto) {
        return this.subdomainService.verifySubdomain(body.token);
    }

    @ApiResponse({
        status: 200,
        description: 'Get subdomain plan',
    })
    @Get('/plan/:planKey')
    getSubdomainPlan(@Param('planKey') planKey: string) {
        return this.subdomainService.getSubdomainPlan(planKey);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subodmain billing info',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SUBDOMAIN_ADMIN)
    @Patch('/billing')
    updateBillingInfo(@Req() req: any, @Body() dto: UpdateBillingDto) {
        return this.subdomainService.updateBillingInfo(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subodmain expire time',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch('/expire')
    updateExpireTieme(@Body() dto: UpdateExpireTimeDto) {
        return this.subdomainService.updateExpireTime(dto);
    }
}
