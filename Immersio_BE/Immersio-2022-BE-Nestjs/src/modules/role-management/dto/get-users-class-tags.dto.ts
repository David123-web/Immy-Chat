import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class GetUsersClassTagDto {
    @ApiProperty({
        type: Array<string>,
        default: ['string'],
    })
    @IsArray()
        ids: string[];
}
