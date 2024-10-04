import { Module } from '@nestjs/common';
import { SubdomainSettingsService } from './subdomain-settings.service';
import { SubdomainSettingsController } from './subdomain-settings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SubdomainSettingsController],
    providers: [SubdomainSettingsService]
})
export class SubdomainSettingsModule {}
