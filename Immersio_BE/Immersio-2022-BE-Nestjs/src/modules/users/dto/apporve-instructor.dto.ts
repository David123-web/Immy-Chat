import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export default class ApproveInstructorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
      userId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
      isApproved: boolean;
}
