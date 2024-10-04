import { Body, Controller, Get, Post, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PaginationSortDto } from 'src/common/dto';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

  @ApiResponse({
      status: 200,
      description: 'Create transaction',
  })
  @Post()
  @Roles(Role.SUBDOMAIN_ADMIN)
    create(@Req() req: any, @Body() dto: CreateTransactionDto) {
        return this.transactionsService.create(req.subdomainId, dto);
    }

  @ApiResponse({
      status: 200,
      description: 'Get all transactions',
  })
  @Get()
  findAll(@Req() req: any, @Query() dto: PaginationSortDto) {
      return this.transactionsService.findAll(req.user.id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Get transaction by id',
  })
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
      return this.transactionsService.findOne(id);
  }
}
