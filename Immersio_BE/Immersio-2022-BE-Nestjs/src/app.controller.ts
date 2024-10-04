import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { SendSMSHelper } from './helpers/send-sms';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly smsHelper: SendSMSHelper
    ) {}

    @Get()
    getHello(@Req() req: any): string {
        return this.appService.getHello();
    }

    // @Get('sms')
    // async sms() {
    //     await this.smsHelper.sendTwilioSMS(
    //         '+16042306368',
    //         'Immersio test send sms'
    //     );
    //     return true;
    // }
}
