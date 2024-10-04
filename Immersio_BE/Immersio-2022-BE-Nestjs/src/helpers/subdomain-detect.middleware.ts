/* eslint-disable @typescript-eslint/no-explicit-any */
import {BadRequestException,
    Injectable,
    NestMiddleware,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import * as moment from 'moment';
import { InjectKysely } from 'nestjs-kysely';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export async function subdomainDetectMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const jwtService = new JwtService();

    const token = req.headers.authorization;
    if (token) {
        const decoded = jwtService.decode(token.replace('Bearer ', ''));
        if (decoded) {
            (req as any).subdomainId = (decoded as object)['subdomainId'];
        } else {
            (req as any).subdomainId = null;
        }
    } else {
        const subdomainFromHeader = (req.headers as any).subdomainid;
        if (subdomainFromHeader) {
            (req as any).subdomainId = subdomainFromHeader;
        } else {
            (req as any).subdomainId = null;
        }
    }
    next();
}

@Injectable()
export class SubdomainDetectMiddleware implements NestMiddleware {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        @InjectKysely() private db: Kysely<DB>
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        if (token) {
            const decoded = this.jwtService.decode(
                token.replace('Bearer ', '')
            );
            if (decoded) {
                await this._checkSubdomain((decoded as object)['subdomainId']);
                (req as any).subdomainId = (decoded as object)['subdomainId'];
            } else {
                (req as any).subdomainId = null;
            }
        } else {
            const subdomainFromHeader = (req.headers as any).subdomainid;
            if (subdomainFromHeader) {
                await this._checkSubdomain(subdomainFromHeader);
                (req as any).subdomainId = subdomainFromHeader;
            } else {
                (req as any).subdomainId = null;
            }
        }

        next();
    }

    private async _checkSubdomain(subdomainId: string): Promise<void> {
        const checkSubdomain = await this.db.selectFrom('Subdomain').where('id', '=', subdomainId).select(['isActive', 'expiredAt']).executeTakeFirst();

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
