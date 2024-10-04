import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubdomainPlanFeature } from '@prisma/client';

export class CreateRootPackageDto {
  @ApiProperty()
      title: string;
  @ApiProperty()
      price: number;
  @ApiProperty()
      metadata: object;
  @ApiPropertyOptional()
      storageLimit: number;
  @ApiPropertyOptional()
      sampleLessons: number;
  @ApiProperty()
      features: SubdomainPlanFeature[];
  @ApiProperty()
      term: number;
  @ApiPropertyOptional()
      trial: boolean;
}
