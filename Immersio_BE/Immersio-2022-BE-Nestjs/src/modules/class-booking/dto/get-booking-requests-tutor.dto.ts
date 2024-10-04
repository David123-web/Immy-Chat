import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SearchParamsDto } from 'src/common/dto';

export class GetBookingRequestsTutorDto extends SearchParamsDto {
    @ApiPropertyOptional()
    @IsOptional()
        onlyConfirmed: boolean;
}
