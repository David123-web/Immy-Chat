import { ApiProperty } from '@nestjs/swagger';

export default class PaypalCancelSubscriptionDto {
    @ApiProperty()
        id: string;
}