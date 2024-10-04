import { ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyOption } from '@prisma/client';

export class UpdateSubdomainCreditValueDto {
    @ApiPropertyOptional({
        default: CurrencyOption.USD,
        enum: CurrencyOption
    })
        currency: CurrencyOption;

    @ApiPropertyOptional()
        creditValue: number;
}
