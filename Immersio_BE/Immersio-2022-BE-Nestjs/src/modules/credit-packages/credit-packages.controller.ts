// import {Controller,
//     Get,
//     Post,
//     Body,
//     Query,
//     Patch,
//     Param,
//     Delete,
//     UseGuards,
//     Req,} from '@nestjs/common';
// import {ApiBearerAuth,
//     ApiHeader,
//     ApiResponse,
//     ApiTags,} from '@nestjs/swagger';
// import { Role } from '@prisma/client';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { Roles } from '../auth/roles.decorator';
// import { RolesGuard } from '../auth/roles.guard';
// import { CreditPackagesService } from './credit-packages.service';
// import { CreateCreditPackageDto } from './dto/create-credit-package.dto';
// import { FindCreditPackagesDto } from './dto/find-credit-packages.dto';
// import { UpdateCreditPackageDto } from './dto/update-credit-package.dto';

// @ApiTags('credit-packages')
// @Controller('credit-packages')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// @ApiHeader({
//     name: 'subdomainid',
//     description: 'Subdomain ID',
// })
// export class CreditPackagesController {
//     constructor(
//         private readonly creditPackagesService: CreditPackagesService
//     ) {}

//     @ApiResponse({
//         status: 200,
//         description: 'Create credit package',
//     })
//     @Post()
//     @UseGuards(RolesGuard)
//     @Roles(Role.SUBDOMAIN_ADMIN)
//     create(
//         @Req() req: any,
//         @Body() createCreditPackageDto: CreateCreditPackageDto
//     ) {
//         return this.creditPackagesService.create(
//             req.user.id,
//             createCreditPackageDto
//         );
//     }

//     @ApiResponse({
//         status: 200,
//         description: 'Get all credit packages',
//     })
//     @Get()
//     findAll(@Req() req: any, @Query() dto: FindCreditPackagesDto) {
//         return this.creditPackagesService.findAll(req.subdomainId, dto);
//     }

//     @ApiResponse({
//         status: 200,
//         description: 'Get details credit package by id',
//     })
//     @Get(':id')
//     findOne(@Req() req: any, @Param('id') id: string) {
//         return this.creditPackagesService.findOne(req.subdomainId, id);
//     }

//     @ApiResponse({
//         status: 200,
//         description: 'Restore credit package by id',
//     })
//     @UseGuards(RolesGuard)
//     @Roles(Role.SUBDOMAIN_ADMIN)
//     @Patch('restore/:id')
//     restore(@Req() req: any, @Param('id') id: string) {
//         return this.creditPackagesService.restore(req.user.id, id);
//     }

//     @ApiResponse({
//         status: 200,
//         description: 'Update credit package by id',
//     })
//     @UseGuards(RolesGuard)
//     @Roles(Role.SUBDOMAIN_ADMIN)
//     @Patch(':id')
//     update(
//         @Req() req: any,
//         @Param('id') id: string,
//         @Body() updateCreditPackageDto: UpdateCreditPackageDto
//     ) {
//         return this.creditPackagesService.update(
//             req.user.id,
//             id,
//             updateCreditPackageDto
//         );
//     }

//     @ApiResponse({
//         status: 200,
//         description: 'Delete credit package by id',
//     })
//     @Roles(Role.SUBDOMAIN_ADMIN)
//     @Delete(':id')
//     remove(@Req() req: any, @Param('id') id: string) {
//         return this.creditPackagesService.remove(req.user.id, id);
//     }
// }
