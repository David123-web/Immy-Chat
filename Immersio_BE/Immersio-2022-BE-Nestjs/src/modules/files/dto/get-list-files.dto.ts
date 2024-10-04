import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationSortDto } from 'src/common/dto';

export class GetListFilesDto extends PaginationSortDto {
    @ApiPropertyOptional({
        default: '' 
    })
        search: string;
    @ApiPropertyOptional()
        folderId: 'root' | string;
}