import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FindDialogsDto {
    @ApiPropertyOptional()
    @IsNumber()
    lessonId: number
}
