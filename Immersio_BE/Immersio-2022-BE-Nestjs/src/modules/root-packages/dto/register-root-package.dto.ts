import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    @ApiPropertyOptional()
        zip: string;
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

export class RegisterRootPackageDto {
    @ApiProperty()
        name: string;
    @ApiProperty()
        email: string;
    @ApiProperty()
        phone: string;
    @ApiPropertyOptional()
        card: CustomerCardDto;
    @ApiPropertyOptional()
        address: CustomerAddressDto;
}

