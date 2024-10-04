import { ApiProperty } from '@nestjs/swagger';

export default class StripeOneTimePaymentDto {
    @ApiProperty()
        packageId: string;
}