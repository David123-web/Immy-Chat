import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SubdomainSettingsService } from '../subdomain-settings/subdomain-settings.service';
import { CourseType } from '@prisma/client';

@Injectable()
export class FreeCoursesMiddleware implements NestMiddleware {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly subdomainSettingsService: SubdomainSettingsService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const isFree = req.body.courseType === CourseType.FREE;
        const subdomainId = (req as any).subdomainId;

        if (isFree) {
            const subdomainSettings = await this.subdomainSettingsService.get(
                subdomainId
            );
            const freeCourses = subdomainSettings.freeCourses;

            const count = await this.prismaService.course.count({
                where: {
                    isFree: true,
                    subdomainId,
                },
            });

            if (count >= freeCourses) {
                throw new HttpException('Free courses limit reached', 429);
            }
        }

        next();
    }
}
