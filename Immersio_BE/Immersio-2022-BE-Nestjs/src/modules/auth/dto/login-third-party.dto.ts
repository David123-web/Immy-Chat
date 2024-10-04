import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, SocialMediaType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export default class ThirdPartyDto {
  @ApiPropertyOptional()
  @IsEnum(Role)
      role: Role;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
      socialId: string;

  @ApiProperty()
  @IsEnum(SocialMediaType)
  @IsNotEmpty()
      socialType: SocialMediaType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
      accessToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
      firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
      lastName: string;
}
