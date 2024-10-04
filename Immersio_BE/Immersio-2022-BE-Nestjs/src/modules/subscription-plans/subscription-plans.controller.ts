import {Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,
    Query,} from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';
import { SearchParamsDto } from 'src/common/dto';

@ApiTags('subscription-plans')
@Controller('subscription-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader(SubdomainHeader)
export class SubscriptionPlansController {
    constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService
    ) { }

  @ApiResponse({
      status: 200,
      description: 'Create subscription plan',
  })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    create(@Req() req, @Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
        console.log('creating plan');
        //// set default values (tried other ways, none worked :( ))
        //// Jake's "workaround" , see https://github.com/Immersio-io/Immersio-2022-BE-Nestjs/pull/283/files#r1452045593
        createSubscriptionPlanDto.isActive = true;
        return this.subscriptionPlansService.create(req.subdomainId, createSubscriptionPlanDto);
    }



  @Get()
  @ApiResponse({
      description:
          'Retrieves instructors based on subdomainId and search parameters.',
      status: 200,
  })
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  getUsersOfInstructor(@Query() query: SearchParamsDto, @Req() req: any) {
      return this.subscriptionPlansService.findMany(
          req.subdomainId,
          {
              ...query, 
          }
      );
  }

  @ApiResponse({
      status: 200,
      description: 'Get subscription plan by id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.subscriptionPlansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto
  ) {
      return this.subscriptionPlansService.update(id, updateSubscriptionPlanDto);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete subscription plan',
  })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
      return this.subscriptionPlansService.remove(id);
  }
}
