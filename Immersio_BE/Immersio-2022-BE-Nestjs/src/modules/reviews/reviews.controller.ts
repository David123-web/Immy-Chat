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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { PaginationSortDto } from 'src/common/dto';

@Controller('reviews')
@ApiTags('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

  @ApiResponse({
      status: 200,
      description: 'Create review',
  })
  @Post()
  @Roles(Role.STUDENT, Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    create(@Req() req: any, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(
            req.user.id,
            createReviewDto
        );
    }

  @ApiResponse({
      status: 200,
      description: 'Get all reviews',
  })
  @Get()
  findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.reviewsService.findAll(req.subdomainId, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get review by id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.reviewsService.findOne(id);
  }

  @ApiResponse({
      status: 200,
      description: 'Update review by id',
  })
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  restore(@Req() req: any, @Param('id') id: string) {
      return this.reviewsService.restore(req.subdomainId, req.userId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete review by id',
  })
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  remove(@Req() req: any, @Param('id') id: string) {
      return this.reviewsService.remove(req.subdomainId, req.userId, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Delete permanent',
  })
  @Delete(':id/permanent')
  @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
  removePermanent(@Req() req: any, @Param('id') id: string) {
      return this.reviewsService.permanentRemove(req.subdomainId, req.userId, id);
  }
}
