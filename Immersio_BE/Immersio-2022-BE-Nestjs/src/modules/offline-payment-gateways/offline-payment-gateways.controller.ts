import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,} from '@nestjs/common';
import { OfflinePaymentGatewaysService } from './offline-payment-gateways.service';
import { CreateOfflinePaymentGatewayDto } from './dto/create-offline-payment-gateway.dto';
import { UpdateOfflinePaymentGatewayDto } from './dto/update-offline-payment-gateway.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PaginationSortDto } from 'src/common/dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('offline-payment-gateways')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('offline-payment-gateways')
@ApiHeader(SubdomainHeader)
export class OfflinePaymentGatewaysController {
    constructor(
    private readonly offlinePaymentGatewaysService: OfflinePaymentGatewaysService
    ) {}

  @ApiResponse({
      status: 200,
      description: 'Create offline payment gateway',
  })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    create(
    @Req() req: any,
    @Body() createOfflinePaymentGatewayDto: CreateOfflinePaymentGatewayDto
    ) {
        return this.offlinePaymentGatewaysService.create(
            req.user.id,
            createOfflinePaymentGatewayDto
        );
    }

  @ApiResponse({
      status: 200,
      description: 'Get all offline payment gateways',
  })
  @Get()
  findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.offlinePaymentGatewaysService.findAll(req.user.id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get offline payment gateway by id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.offlinePaymentGatewaysService.findOne(id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update offline payment gateway',
  })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateOfflinePaymentGatewayDto: UpdateOfflinePaymentGatewayDto
  ) {
      return this.offlinePaymentGatewaysService.update(
          req.user.id,
          id,
          updateOfflinePaymentGatewayDto
      );
  }

  @ApiResponse({
      status: 200,
      description: 'Delete offline payment gateway',
  })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  remove(@Req() req: any, @Param('id') id: string) {
      return this.offlinePaymentGatewaysService.remove(req.user.id, id);
  }
}
