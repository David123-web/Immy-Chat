// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
// import { RootPackagesService } from './root-packages.service';
// import { CreateRootPackageDto } from './dto/create-root-package.dto';
// import { UpdateRootPackageDto } from './dto/update-root-package.dto';
// import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '@prisma/client';
// import { PaginationSortDto } from 'src/common/dto';
// import { RegisterRootPackageDto } from './dto/register-root-package.dto';

// @ApiTags('root-packages')
// @Controller('root-packages')
// @ApiHeader({
//     name: 'subdomainid',
//     description: 'Subdomain Id'
// })
// export class RootPackagesController {
//     constructor(private readonly rootPackagesService: RootPackagesService) { }

//   @ApiResponse({
//       status: 200,
//       description: 'Create root package',
//   })
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUPER_ADMIN)
//   @Post()
//     create(@Body() createRootPackageDto: CreateRootPackageDto) {
//         return this.rootPackagesService.create(createRootPackageDto);
//     }

//   @ApiResponse({
//       status: 200,
//       description: 'Get all root packages',
//   })
//   @Get()
//   findAll(@Query() dto: PaginationSortDto) {
//       return this.rootPackagesService.findAll(dto);
//   }

//   @ApiResponse({
//       status: 200,
//       description: 'Get root package by id',
//   })
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//       return this.rootPackagesService.findOne(id);
//   }

//   @ApiResponse({
//       status: 200,
//       description: 'Update root package',
//   })
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUPER_ADMIN)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRootPackageDto: UpdateRootPackageDto) {
//       return this.rootPackagesService.update(id, updateRootPackageDto);
//   }

//   @ApiResponse({
//       status: 200,
//       description: 'Delete root package',
//   })
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUPER_ADMIN)
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//       return this.rootPackagesService.remove(id);
//   }


//   @ApiResponse({
//       status: 200,
//       description: 'Register root package',
//   })
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUBDOMAIN_ADMIN)
//   @Post('register')
//   register(@Req() req: any, @Body() data: RegisterRootPackageDto) {
//       return this.rootPackagesService.register(req.subdomainId, req.user.id, data);
//   }
// }
