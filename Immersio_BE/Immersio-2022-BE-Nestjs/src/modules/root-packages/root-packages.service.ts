// import { Injectable, NotFoundException } from '@nestjs/common';
// import moment from 'moment';
// import { PaginationSortDto } from 'src/common/dto';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateRootPackageDto } from './dto/create-root-package.dto';
// import { UpdateRootPackageDto } from './dto/update-root-package.dto';
// import { StripeHelper } from 'src/helpers/stripe';
// import { PaypalHelper } from 'src/helpers/paypal';
// import { RegisterRootPackageDto } from './dto/register-root-package.dto';

// @Injectable()
// export class RootPackagesService {
//     constructor(
//         private readonly prisma: PrismaService,
//         private readonly stripeHelper: StripeHelper,
//         private readonly paypalHelper: PaypalHelper,
//     ) {}
//     async create(data: CreateRootPackageDto) {
//         return this.prisma.rootPackage.create({
//             data
//         });
//     }

//     async findAll({
//         skip,
//         take,
//         cursorId,
//         sortBy,
//         sortDesc,
//     }: PaginationSortDto) {
//         return this.prisma.rootPackage.findMany({
//             skip,
//             take,
//             cursor: cursorId && {
//                 id: cursorId,
//             },
//             orderBy: sortBy && {
//                 [sortBy]: sortDesc ? 'desc' : 'asc',
//             },
//             where: {
//                 isDeleted: false,
//             },
//         });
//     }

//     async findOne(id: string) {
//         const sp = await this.prisma.rootPackage.findUnique({
//             where: {
//                 id,
//             },
//         });
//         if (!sp || sp.isDeleted) throw new NotFoundException();
//         return sp;
//     }

//     async update(
//         id: string,
//         updateRootPackageDto: UpdateRootPackageDto
//     ) {
//         await this.findOne(id);
//         return this.prisma.rootPackage.update({
//             where: {
//                 id,
//             },
//             data: updateRootPackageDto,
//         });
//     }

//     async remove(id: string) {
//         await this.findOne(id);
//         return this.prisma.rootPackage.update({
//             where: {
//                 id,
//             },
//             data: {
//                 isDeleted: true,
//                 deletedAt: moment().toISOString(),
//             },
//         });
//     }

//     async register(subdomainId: string, userId: string, data: RegisterRootPackageDto) {
//         console.log(data);
//         const user = await this.prisma.user.findUnique({
//             where: {
//                 subdomainId, id: userId
//             }
//         });
        
//         const subdomain = await this.prisma.subdomain.findUnique({
//             where: {
//                 id: subdomainId
//             }
//         });

//         if (!user) throw new NotFoundException('User not found!');
//         if(!subdomain) throw new NotFoundException('Subdomain not found!');
        
//         if(!subdomain.stripeAccountId) {
//             const result = await this.stripeHelper.createRootCustomer(subdomain, data);
//             console.log(result);
//         }
        
//         return true;
//     }
// }
