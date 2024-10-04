import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGatewayType, PaymentMethod } from '@prisma/client';

export class UpdateBillingDto {
    @ApiPropertyOptional()
        firstName: string;
    @ApiPropertyOptional()
        lastName: string;
    @ApiPropertyOptional()
        streetAddress: string;
    @ApiPropertyOptional()
        companyName: string;
    @ApiPropertyOptional()
        phoneNumber: string;
    @ApiPropertyOptional()
        country: string;
    @ApiPropertyOptional()
        email: string;
    @ApiPropertyOptional()
        city: string;
    @ApiPropertyOptional()
        state: string;
    @ApiPropertyOptional()
        paymentMethod: PaymentGatewayType;
    @ApiPropertyOptional()
        coupon: string;

}