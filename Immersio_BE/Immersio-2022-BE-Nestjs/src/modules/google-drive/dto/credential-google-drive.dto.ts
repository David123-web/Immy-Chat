import { ApiPropertyOptional } from '@nestjs/swagger';

export class CredentialGoogleDriveDto {
  @ApiPropertyOptional()
      googleClientId: string;

  @ApiPropertyOptional()
      googleClientSecret: string;

  @ApiPropertyOptional()
      googleRefreshToken: string;
}
