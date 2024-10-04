import { ApiProperty } from '@nestjs/swagger';

export default class PaypalSubscribeDto {
    @ApiProperty()
        planId: string;
}