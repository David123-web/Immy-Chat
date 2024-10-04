/* eslint-disable @typescript-eslint/no-explicit-any */
import {BadRequestException,
    Injectable,
    InternalServerErrorException,
    NestMiddleware,
    NotFoundException,
    UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { Kysely } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { DB } from 'kysely/types';
import * as moment from 'moment';
import { InjectKysely } from 'nestjs-kysely';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class SubdomainAndUserDetectMiddleware implements NestMiddleware {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        @InjectKysely() private db: Kysely<DB>
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        if (token && !token.startsWith('Basic ')) {
            const decodedData = this.jwtService.decode(
                token.replace('Bearer ', '')
            );
            if (decodedData) {
                const { checkSubdomain, user } = await this.db.selectNoFrom(eb => [
                    jsonObjectFrom(eb.selectFrom('Subdomain').where('id', '=', decodedData['subdomainId']).select(['isActive', 'expiredAt'])).as('checkSubdomain'),
                    jsonObjectFrom(eb.selectFrom('User').where('id', '=', decodedData['id']).select(['role', 'status', 'isActive'])).as('user')
                ]).executeTakeFirst();
                this._checkSubdomain(checkSubdomain);
                this._userStatusDetect(user);
                (req as any).subdomainId = decodedData['subdomainId'];
            } else {
                throw new InternalServerErrorException();
            }
        } else {
            const subdomainFromHeader = (req.headers as any).subdomainid;
            if (subdomainFromHeader) {
                const checkSubdomain = await this.db.selectFrom('Subdomain').where('id', '=', subdomainFromHeader).select(['isActive', 'expiredAt']).executeTakeFirst();
                this._checkSubdomain(checkSubdomain);
                (req as any).subdomainId = subdomainFromHeader;
            } else {
                (req as any).subdomainId = null;
            }
        }

        next();
    }

    private async _userStatusDetect(user: any) {
        const acceptedRoles = [Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN];
        const acceptedStatus = [UserStatus.ACTIVE, UserStatus.APPROVED];
        if (!user) throw new NotFoundException('User not found');
        if (
            !acceptedRoles.includes(user.role as any) &&
            !acceptedStatus.includes(user.status as any)
        )
            throw new NotFoundException('Login failed');
        if (!user.isActive) {
            throw new UnauthorizedException('Your account is not active');
        }

    }

    private async _checkSubdomain(checkSubdomain: any) {
        if (!checkSubdomain) {
            throw new BadRequestException('Sub-domain not exist!');
        }

        if (!checkSubdomain.isActive) {
            throw new BadRequestException('Sub-domain deactivated!');
        }

        if (checkSubdomain.expiredAt && moment(checkSubdomain.expiredAt).isBefore()) {
            throw new BadRequestException('Sub-domain has expired!');
        }
    }
}
