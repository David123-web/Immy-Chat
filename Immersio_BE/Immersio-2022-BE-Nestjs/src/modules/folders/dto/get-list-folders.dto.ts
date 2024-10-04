import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationSortDto } from 'src/common/dto';

export class GetListFoldersDto extends PaginationSortDto {
    @ApiPropertyOptional({
        default: '' 
    })
        search: string;
    @ApiPropertyOptional()
        parentFolderId: 'root' | string;
    @ApiPropertyOptional()
        fixed: boolean;
}