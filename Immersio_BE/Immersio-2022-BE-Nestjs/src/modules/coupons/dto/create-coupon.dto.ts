import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponType, CurrencyOption } from '@prisma/client';

export class CreateCouponDto {
    @ApiProperty()
        name: string;

    @ApiProperty()
        code: string;

    @ApiProperty({
        enum: CouponType
    })
        type: CouponType;

    @ApiProperty()
        value: number;

    @ApiPropertyOptional()
        currency: CurrencyOption;

    @ApiPropertyOptional()
        startAt: string;

    @ApiPropertyOptional()
        endAt: string;

    @ApiPropertyOptional()
        subscriptionPlanIds: string[];

    @ApiPropertyOptional()
        subdomainPlanIds: string[];

    @ApiPropertyOptional()
        limit: number;
}
