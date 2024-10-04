import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class PaginationDto<T> {
    @ApiProperty()
        skip: number;

    @ApiProperty()
        take: number;

    @ApiPropertyOptional()
        cursorId: T;
}

export class SortDto {
    @ApiPropertyOptional()
        sortBy: string;

    @ApiPropertyOptional()
        sortDesc: boolean;
}

export class UUIDPaginationDto {
    @ApiProperty()
        skip: number;

    @ApiProperty()
        take: number;

    @ApiPropertyOptional()
        cursorId: string;
}

export class UUIDPaginationSortDto extends SortDto {
    @ApiProperty()
        skip: number;

    @ApiProperty()
        take: number;

    @ApiPropertyOptional()
        cursorId: string;
}

export class PaginationSortDto extends SortDto {
    @ApiProperty()
        skip: number;

    @ApiProperty()
        take: number;

    @ApiPropertyOptional()
        cursorId?: string;

    @ApiPropertyOptional()
        isDeleted?: boolean;
}

export class SearchParamsDto extends PaginationSortDto {
    @ApiPropertyOptional()
        searchKey?: string;

    @ApiPropertyOptional()
        searchBy?: string;
}

export class SearchParamsOnlyDto {
    @ApiPropertyOptional()
        searchKey?: string;

    @ApiPropertyOptional()
        searchBy?: string;
}

export class UploadBinaryFileDto {
    @ApiProperty({
        type: 'string', format: 'binary'
    })
        file: any;
}
