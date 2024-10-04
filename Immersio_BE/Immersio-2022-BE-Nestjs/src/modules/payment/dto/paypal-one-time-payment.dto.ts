import { ApiProperty } from '@nestjs/swagger';

export default class PaypalOneTimePaymentDto {
    @ApiProperty()
        packageId: string;
}