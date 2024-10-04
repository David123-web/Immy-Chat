import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSubdomainSettingDto } from './create-subdomain-setting.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UpdateSubdomainSocialDto } from './update-subdomain-social.dto';
import { UpdateSubdomainSupportLinksDto } from './update-subdomain-support-links.dto';
import { CurrencyOption } from '@prisma/client';

export class UpdateSubdomainSettingDto extends PartialType(
    CreateSubdomainSettingDto
) {
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
        paypalActive: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
        paypalTestMode: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        paypalClientId: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        paypalClientSecret: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
        stripeActive: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        stripeKey: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        stripeSecret: string;
    
        
    @ApiPropertyOptional()
    @IsOptional()
        daysBeforeExpirationReminder: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
        address: string;

    @ApiPropertyOptional({
        type: UpdateSubdomainSocialDto,
    })
    @IsOptional()
        socialLinks?: UpdateSubdomainSocialDto;

    @ApiPropertyOptional({
        type: UpdateSubdomainSupportLinksDto,
    })
    @ApiPropertyOptional({
        default: CurrencyOption.USD,
        enum: CurrencyOption
    })
        currency: CurrencyOption;

    @ApiPropertyOptional()
        creditValue: number;

    @IsOptional()
        supportLinks?: UpdateSubdomainSupportLinksDto;
}
