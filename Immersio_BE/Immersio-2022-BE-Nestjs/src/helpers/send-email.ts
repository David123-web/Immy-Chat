/* eslint-disable @typescript-eslint/ban-types */
import * as sendgrid from '@sendgrid/mail';
import * as fs from 'fs';

export class SendEmailHelper {
    constructor() {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async send(
        to: string,
        subject: string,
        templatePath?: string,
        data?: Object
    ): Promise<boolean> {
        const html = this.buildStringTemplate(templatePath, data);

        const msg = {
            to,
            subject,
            html,
            from: process.env.SENDGRID_EMAIL_FROM,
        };
        try {
            await sendgrid.send(msg);
            return true;
        } catch (err) {
            console.log(JSON.stringify(err));
            return false;
        }
    }

    /**
   * Example:
   * this._buildStringTemplate(
      path.join(__dirname, "./../../client/html/email.html"),
      {name: "Gia Boi"}
    ); 
   */
    public buildStringTemplate(path: string, data: object = {
    }): string {
        const template = fs.readFileSync(path);
        const templateString = template.toString('utf8');
        return templateString.replace(/{{([^{}]+)}}/g, function (_, key) {
            return data[key] || '';
        });
    }
}
