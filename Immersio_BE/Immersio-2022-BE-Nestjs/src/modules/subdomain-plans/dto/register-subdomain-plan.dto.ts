import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CustomerAddressDto {
    @ApiPropertyOptional()
        country: string;
    @ApiPropertyOptional()
        state: string;
    @ApiPropertyOptional()
        city: string;
    @ApiPropertyOptional()
        line1: string;
    @ApiPropertyOptional()
        line2: string;
}

export class CustomerCardDto {
    @ApiProperty()
        number: string;
    @ApiProperty()
        expMonth: number;
    @ApiProperty()
        expYear: number;
    @ApiProperty()
        cvc: string;
}

export class RegisterSubdomainPlanDto {
    @ApiProperty()
        name: string;
    @ApiProperty()
        email: string;
    @ApiProperty()
        phone: string;
    // @ApiPropertyOptional()
    //     card: CustomerCardDto;
    @ApiPropertyOptional()
        address: CustomerAddressDto;
}

