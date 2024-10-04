import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiPropertyOptional()
      fileId: string;
  @ApiPropertyOptional()
      text: string;
  @ApiPropertyOptional()
      url: string;
  @ApiProperty()
      textPosition: string;
  @ApiProperty()
      fontSize: number;
  @ApiProperty()
      textColor: string;
  @ApiProperty()
      order: number;
  @ApiPropertyOptional()
      delay: number;
}
