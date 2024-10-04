import { ApiProperty } from '@nestjs/swagger';
import { PaymentGatewayType, PaymentMethod } from '@prisma/client';
import {IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    MaxLength,
    MinLength,
    ValidateNested,} from 'class-validator';

class Theme {
    @ApiProperty()
        primaryColor: string;

    @ApiProperty()
        secondaryColor: string;

    @ApiProperty()
        accentColor: string;

    @ApiProperty()
        backgroundColor: string;

    @ApiProperty()
        textColor: string;

    @ApiProperty()
        linkColor: string;

    @ApiProperty()
        logoUrl: string;

    @ApiProperty()
        faviconUrl: string;
}

export class Billing {
    @ApiProperty()
        phoneNumber: string;

    @ApiProperty()
        companyName: string;

    @ApiProperty()
        streetAddress: string;

    @ApiProperty()
    @IsNotEmpty()
        city: string;

    @ApiProperty()
    @IsNotEmpty()
        state: string;

    @ApiProperty()
        country: string;

    @ApiProperty()
        coupon: string;

    @ApiProperty()
    @IsEnum(PaymentGatewayType)
        paymentMethod: PaymentGatewayType;
}

export class RegisterSubdomainDto {
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(25)
    @MinLength(3)
        domainName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
        email: string;

    @ApiProperty()
    @IsNotEmpty()
        password: string;

    @ApiProperty()
    @IsNotEmpty()
        firstName: string;

    @ApiProperty()
    @IsNotEmpty()
        lastName: string;

    @ApiProperty()
        answerAlready: string;

    @ApiProperty()
        languageSpoken: number;

    @ApiProperty()
        languagesTeaching: number[];

    @ApiProperty()
        description: string;

    @ApiProperty()
    @IsNotEmpty()
        planKey: string;

    @ApiProperty()
    @ValidateNested()
        theme: Theme;

    @ApiProperty()
    @ValidateNested()
        billing: Billing;
}
