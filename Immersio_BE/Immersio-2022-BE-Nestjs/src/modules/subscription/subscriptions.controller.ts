import {Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('subscriptions')
@Controller('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader(SubdomainHeader)
export class SubscriptionsController {
    constructor(
    private readonly subscriptionsService: SubscriptionsService
    ) { }



  @ApiResponse({
      status: 200,
      description: 'Get all subscriptions',
  })
  @Get()
    findAll(@Req() req) {
        return this.subscriptionsService.findAll(req.subdomainId);
    }

  @ApiResponse({
      status: 200,
      description: 'Get subscription plan by id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.subscriptionsService.findOne(id);
  }




}
