import {Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Req,} from '@nestjs/common';
import { OnlinePaymentGatewaysService } from './online-payment-gateways.service';
import { UpdateOnlinePaymentGatewayDto } from './dto/update-online-payment-gateway.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('online-payment-gateways')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('online-payment-gateways')
@ApiHeader(SubdomainHeader)
export class OnlinePaymentGatewaysController {
    constructor(
    private readonly onlinePaymentGatewaysService: OnlinePaymentGatewaysService
    ) {}

  @ApiResponse({
      status: 200,
      description: 'Update online payment gateway',
  })
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    update(
    @Req() req: any,
    @Body() updateOnlinePaymentGatewayDto: UpdateOnlinePaymentGatewayDto
    ) {
        return this.onlinePaymentGatewaysService.update(
            req.user.id,
            updateOnlinePaymentGatewayDto
        );
    }

  @ApiResponse({
      status: 200,
      description: 'Get all online payment gateways',
  })
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  findAll(@Req() req: any) {
      return this.onlinePaymentGatewaysService.findAll(req.user.id);
  }
}
