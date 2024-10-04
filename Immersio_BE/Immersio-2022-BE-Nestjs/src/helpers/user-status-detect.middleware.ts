/* eslint-disable @typescript-eslint/no-explicit-any */
import {ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NestMiddleware,
    NotFoundException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { InjectKysely } from 'nestjs-kysely';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserStatusDetectMiddleware implements NestMiddleware {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        @InjectKysely() private db: Kysely<DB>
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        if (token) {
            const decoded = this.jwtService.decode(
                token.replace('Bearer ', '')
            );
            if (decoded) {
                const acceptedRoles = [Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN];
                const acceptedStatus = [UserStatus.ACTIVE, UserStatus.APPROVED];
                const foundUser = await this.db.selectFrom('User').where('id', '=', (decoded as object)['id']).select(['role', 'status']).executeTakeFirst();
                if (!foundUser) throw new NotFoundException('User not found');
                if (
                    !acceptedRoles.includes(foundUser.role as any) &&
                    !acceptedStatus.includes(foundUser.status as any)
                )
                    throw new NotFoundException('Login failed');
            } else {
                throw new InternalServerErrorException();
            }
        }
        next();
    }
}
