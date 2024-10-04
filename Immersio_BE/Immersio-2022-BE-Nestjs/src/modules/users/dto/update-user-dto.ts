import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
    @ApiPropertyOptional()
        firstName: string;

    @ApiPropertyOptional()
        lastName: string;
}