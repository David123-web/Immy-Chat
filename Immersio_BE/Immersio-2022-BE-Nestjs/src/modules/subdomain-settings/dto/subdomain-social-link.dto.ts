import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddSubdomainSocialLinkDto {
    @ApiProperty()
    @IsNotEmpty()
        icon: string;

    @ApiProperty()
    @IsNotEmpty()
        url: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        order: number;
}

export class UpdateSubdomainSocialLinkDto extends AddSubdomainSocialLinkDto {}
