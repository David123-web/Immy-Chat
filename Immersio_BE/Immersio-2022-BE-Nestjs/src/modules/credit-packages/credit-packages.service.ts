// import {
//   ForbiddenException,
//   Injectable,
//   NotFoundException,
// } from "@nestjs/common";
// import { Role } from "@prisma/client";
// import * as moment from "moment";
// import { PrismaService } from "../prisma/prisma.service";
// import { CreateCreditPackageDto } from "./dto/create-credit-package.dto";
// import { FindCreditPackagesDto } from "./dto/find-credit-packages.dto";
// import { UpdateCreditPackageDto } from "./dto/update-credit-package.dto";

// @Injectable()
// export class CreditPackagesService {
//   constructor(private readonly prisma: PrismaService) {}
//   async create(userId: string, createCreditPackageDto: CreateCreditPackageDto) {
//     const user = await this._getUser(userId);
//     return this.prisma.creditPackage.create({
//       data: { ...createCreditPackageDto, subdomainId: user.subdomainId },
//     });
//   }

//   async findAll(
//     subdomainId: string,
//     { name, skip, take, cursorId, sortBy, sortDesc }: FindCreditPackagesDto
//   ) {
//     return this.prisma.creditPackage.findMany({
//       skip,
//       take,
//       cursor: cursorId && { id: cursorId },
//       orderBy: sortBy && { [sortBy]: sortDesc ? "desc" : "asc" },
//       where: {
//         subdomainId,
//         name: name && { contains: name, mode: "insensitive" },
//       },
//     });
//   }

//   async findOne(subdomainId: string, id: string) {
//     const creditPackage = await this.prisma.creditPackage.findUnique({
//       where: { id },
//     });
//     if (!creditPackage || creditPackage.subdomainId !== subdomainId)
//       throw new NotFoundException("Credit package not found!");
//     return creditPackage;
//   }

//   async update(
//     userId: string,
//     id: string,
//     updateCreditPackageDto: UpdateCreditPackageDto
//   ) {
//     const user = await this._getUser(userId);
//     await this.findOne(user.subdomainId, id);
//     return this.prisma.creditPackage.update({
//       where: { id },
//       data: updateCreditPackageDto,
//     });
//   }

//   async remove(userId: string, id: string) {
//     const user = await this._getUser(userId);
//     await this.findOne(user.subdomainId, id);
//     return this.prisma.creditPackage.update({
//       where: { id },
//       data: { isDeleted: true, deletedAt: moment().toISOString() },
//     });
//   }

//   async restore(userId: string, id: string) {
//     const user = await this._getUser(userId);
//     await this.findOne(user.subdomainId, id);
//     return this.prisma.creditPackage.update({
//       where: { id },
//       data: { isDeleted: false, deletedAt: null },
//     });
//   }

//   async addCredit(userId: string, id: string) {
//     const pkg = await this.prisma.creditPackage.findUnique({ where: { id } });
//     if (!pkg) throw new NotFoundException("Credit package not found!");
//     return this.prisma.user.update({
//       where: { id: userId },
//       data: { credit: { increment: pkg.credit } },
//     });
//   }

//   private async _getUser(id: string) {
//     const user = await this.prisma.user.findUnique({ where: { id } });
//     if (!user) throw new NotFoundException("User not found!");
//     if (user.role !== Role.SUBDOMAIN_ADMIN) throw new ForbiddenException();
//     return user;
//   }
// }
