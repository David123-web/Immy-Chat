import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,} from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { UpdateTutoringDto } from './dto/update-tutoring.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SearchParamsDto } from 'src/common/dto';
import { UpdateSharePlanDto } from './dto/update-share-plan.dto';
import { AddTutoringMaterialDto } from './dto/add-tutoring-material.dto';
import { UpdateTutoringMaterialDto } from './dto/update-tutoring-material.dto';

@ApiTags('tutoring')
@Controller('tutoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TutoringController {
    constructor(private readonly tutoringService: TutoringService) {}

    @ApiResponse({
        status: 200,
        description: 'Get all tutoring plans',
    })
    @Get('plans')
    @Roles(Role.TUTOR, Role.INSTRUCTOR)
    getTutoringPlans(@Req() req: any, @Query() query: SearchParamsDto) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.tutoringService.getTutoringPlans(userId, query, role);
    }

    @ApiResponse({
        status: 200,
        description: 'Get updated share plan',
    })
    @Patch('share-plan/:id')
    @Roles(Role.TUTOR)
    updateSharePlan(@Req() req: any, @Param('id') id: string, @Body() body: UpdateSharePlanDto) {
        const userId = req.user.id;
        return this.tutoringService.updateSharePlan(id, userId, body.isShared);
    }

    @ApiResponse({
        status: 200,
        description: 'Get plan by id',
    })
    @Get('plan/:id')
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async getTutoringPlanById(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.tutoringService.getTutoringPlanById(id, userId, role);
    }

    @ApiResponse({
        status: 200,
        description: 'Add tutoring material',
    })
    @Post('plan/:planId/material')
    @Roles(Role.TUTOR)
    async addTutoringMaterial(@Req() req: any,@Param('planId') planId: string, @Body() body: AddTutoringMaterialDto) {
        const userId = req.user.id;
        return this.tutoringService.addTutoringMaterial(planId, userId, body);
    }

    @ApiResponse({
        status: 200,
        description: 'Update tutoring material',
    })
    @Patch('plan/material/:id')
    @Roles(Role.TUTOR)
    async updateTutoringMaterial(@Req() req: any,@Param('id') id: string, @Body() body: UpdateTutoringMaterialDto) {
        const userId = req.user.id;
        return this.tutoringService.updateTutoringMaterial(id, userId, body);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete tutoring material',
    })
    @Delete('plan/material/:id')
    @Roles(Role.TUTOR)
    async deleteTutoringMaterial(@Req() req: any,@Param('id') id: string) {
        const userId = req.user.id;
        return this.tutoringService.deleteTutoringMaterial(id, userId);
    }
}
