import { HttpService } from '@nestjs/axios';
import * as twilio from 'twilio';

const http = new HttpService();

export class SendSMSHelper {
    private speedSMSKey: string;
    private speedSMSUrl: string;

    private twilioAccountSid: string;
    private twilioAuthToken: string;
    private twilioMessagingServiceId: string;
    private twilioClient: twilio.Twilio;

    constructor() {
        this.speedSMSKey = process.env.SPEED_SMS_KEY;
        this.speedSMSUrl = 'https://api.speedsms.vn/index.php/sms/send';

        this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
        this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        this.twilioMessagingServiceId = process.env.TWILIO_MESSAGING_SERVICE_ID;
        this.twilioClient = twilio(this.twilioAccountSid, this.twilioAuthToken);
    }

    async sendSpeedSMS(
        phones: string[],
        content: string,
        type: number,
        sender = ''
    ) {
        const buf = Buffer.from(this.speedSMSKey + ':x');

        const auth = 'Basic ' + buf.toString('base64');

        const req = await http.axiosRef.post(
            this.speedSMSUrl,
            {
                to: phones,
                content: content,
                sms_type: type,
                sender: sender,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: auth,
                },
            }
        );
    }

    async sendTwilioSMS(phone: string, content: string) {
        return this.twilioClient.messages.create({
            body: content,
            to: phone,
            messagingServiceSid: this.twilioMessagingServiceId,
        });
    }
}
