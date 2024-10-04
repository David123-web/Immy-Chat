import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetRootSettingsDto } from './dto/set-root-settings.dto';

@Injectable()
export class RootSettingsService {
    constructor(private readonly prisma: PrismaService) { }
    async update({ key, value }: SetRootSettingsDto) {
        return this.prisma.rootSetting.upsert({
            where: {
                key
            },
            create: {
                key, value
            },
            update: {
                value
            }
        });
    }

    async findAll() {
        return this.prisma.rootSetting.findMany();
    }
}
