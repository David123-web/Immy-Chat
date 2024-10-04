import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubdomainPlanStatus, SubdomainPlanFeature, CurrencyOption } from '@prisma/client';

export class CreateStudentProratedPriceDto {
    price: number;
    studentMinimum: number;
}

export class CreateStorageProratedPriceDto {
    price: number;
    storageMinimum: number;
}

export class CreateSubdomainPlanDto {
    @ApiProperty()
        key: string;
    @ApiPropertyOptional()
        description: string;
    @ApiProperty()
        sampleLessons: number;
    @ApiProperty()
        features: SubdomainPlanFeature[];
    @ApiPropertyOptional()
        customDomain: string;
    @ApiPropertyOptional({
        enum: SubdomainPlanStatus
    })
        status: SubdomainPlanStatus;
    @ApiProperty({
        default: CurrencyOption.USD,
        enum: CurrencyOption
    })
        currency: CurrencyOption;
    @ApiPropertyOptional()
        startAt: string;
    @ApiPropertyOptional()
        contractLength: number;
    @ApiPropertyOptional()
        subdomainId: string;
    @ApiPropertyOptional()
        autoRenewal: boolean;
    @ApiPropertyOptional()
        minimumCharge: number;
    @ApiPropertyOptional()
        daysTrial: number;
    @ApiPropertyOptional()
        studentProratedPrices: any;
    @ApiPropertyOptional()
        storageProratedPrices: any;
}
