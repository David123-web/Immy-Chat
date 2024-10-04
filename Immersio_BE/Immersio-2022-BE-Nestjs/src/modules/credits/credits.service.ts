// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class CreditsService {
//     constructor(private readonly prisma: PrismaService) { }

//     async get(userId: string) {
//         const user = await this._checkAndGetUser(userId)
//         return user.credit
//     }

//     async add(userId: string, amount: number) {
//         this._checkAndGetUser(userId)
//         const result = await this.prisma.user.update({ where: { id: userId }, data: { credit: { increment: amount } } })
//         return result.credit
//     }

//     async update(userId: string, value: number) {
//         this._checkAndGetUser(userId)
//         const result = await this.prisma.user.update({ where: { id: userId }, data: { credit: value } })
//         return result.credit
//     }

//     async _checkAndGetUser(userId: string) {
//         const user = await this.prisma.user.findUnique({ where: { id: userId } })
//         if (!user) throw new NotFoundException('User not found!')
//         return user
//     }
// }

