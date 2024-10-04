import { ApiProperty } from '@nestjs/swagger';

export default class StripeSubscribeDto {
    @ApiProperty()
        planId: string;
}