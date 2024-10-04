import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    Query,
    UseGuards,} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { PaginationSortDto, SearchParamsDto } from '../../common/dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { AddTutoringMaterialDto } from './dto/add-tutoring-material.dto';
import { UpdateTutoringMaterialDto } from './dto/update-tutoring-material.dto';
import { CreateDrillDto } from '../drills/dto/create-drill.dto';
import { UpdateDrillDto } from '../drills/dto/update-drill.dto';
import { SubdomainHeader } from 'src/helpers/common';

@Controller('plan')
@ApiTags('plan')
@ApiHeader(SubdomainHeader)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Post()
    @ApiResponse({
        description:
            'Creates a new plan for a given subdomain, user, and role.',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    create(@Req() req, @Body() createPlanDto: CreatePlanDto) {
        return this.planService.create(
            req.subdomainId,
            req.user.id,
            req.user.role,
            createPlanDto
        );
    }

    @Post(':planId/material')
    @ApiResponse({
        description: 'Adds new tutoring material to a lesson.',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async addTutoringMaterial(
        @Req() req: any,
        @Param('planId') planId: string,
        @Body() body: AddTutoringMaterialDto
    ) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.planService.addTutoringMaterial(planId, userId, role, body);
    }

    @Patch('material/:id')
    @ApiResponse({
        description:
            'Updates a tutoring material with the given id for the user with the given userId.',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async updateTutoringMaterial(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: UpdateTutoringMaterialDto
    ) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.planService.updateTutoringMaterial(id, userId, role, body);
    }

    @Delete('material/:id')
    @ApiResponse({
        description:
            'Deletes a tutoring material with the given ID, if it exists and is owned by the given user.',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async deleteTutoringMaterial(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        return this.planService.deleteTutoringMaterial(id, userId);
    }

    @Post(':planId/drill')
    @ApiResponse({
        description: 'Adds a new drill to a lesson.',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async addDrill(
        @Req() req: any,
        @Param('planId') planId: string,
        @Body() body: CreateDrillDto
    ) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.planService.addDrill(planId, userId, role, body);
    }

    @Patch('drill/:drillId')
    @ApiResponse({
        description:
            'Updates a drill with the given id for the user with the given userId.',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async updateDrill(
        @Req() req: any,
        @Param('drillId') drillId: string,
        @Body() body: UpdateDrillDto
    ) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.planService.updateDrill(drillId, userId, role, body);
    }

    @Delete('drill/:id')
    @ApiResponse({
        description: 'Delete drill with the given id',
        status: 200,
    })
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    async deleteDrill(@Req() req: any, @Param('id') drillId: string) {
        const userId = req.user.id;
        return this.planService.deleteDrill(drillId, userId);
    }

    @Get()
    @ApiResponse({
        description:
            'Retrieves a list of plans that match the specified search parameters.',
        status: 200,
    })
    @Roles(
        Role.SUPER_ADMIN,
        Role.SUBDOMAIN_ADMIN,
        Role.INSTRUCTOR,
        Role.TUTOR,
        Role.STUDENT,
        Role.CUSTOMER_SERVICE
    )
    findAll(@Req() req: any, @Query() query: SearchParamsDto) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.planService.findAll(req.subdomainId, userId, role, query);
    }

    @Get(':id')
    @ApiResponse({
        description:
            'Retrieves a plan with the given ID and subdomain ID, along with its related tutors, students, tutoring materials, drills, and course sections and lessons.',
        status: 200,
    })
    @Roles(
        Role.SUPER_ADMIN,
        Role.SUBDOMAIN_ADMIN,
        Role.INSTRUCTOR,
        Role.TUTOR,
        Role.STUDENT,
        Role.CUSTOMER_SERVICE
    )
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.planService.findOne(req.subdomainId, id);
    }

    @Patch(':id')
    @ApiResponse({
        description:
            'Updates a plan with the specified id using the provided UpdatePlanDto.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR)
    update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
        return this.planService.update(id, updatePlanDto);
    }

    @Delete(':id')
    @ApiResponse({
        description:
            'Deletes a plan with the given ID by setting its isDeleted property to true.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR)
    remove(@Param('id') id: string) {
        return this.planService.remove(id);
    }
}
