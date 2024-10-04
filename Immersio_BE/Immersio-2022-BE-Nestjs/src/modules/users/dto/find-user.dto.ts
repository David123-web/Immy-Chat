import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UUIDPaginationDto } from 'src/common/dto';

export default class FindUserDto extends UUIDPaginationDto {
    @ApiPropertyOptional()
        role: Role;

    @ApiPropertyOptional({
        type: String 
    })
        searchUser: string;

    @ApiPropertyOptional({
        type: String 
    })
        sortBy: string;

    @ApiPropertyOptional({
        type: String 
    })
        sortDesc: string;
}
