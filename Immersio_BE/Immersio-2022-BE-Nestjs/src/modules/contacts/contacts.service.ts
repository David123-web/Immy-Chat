import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { getSubdomainUrl } from 'src/helpers/common';
import { SendEmailHelper } from 'src/helpers/send-email';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';

@Injectable()
export class ContactsService {
    constructor(
        private readonly prisma: PrismaService,
        @InjectKysely() private db: Kysely<DB>
    ){}

    async send({ email, message, name, subject }: CreateContactMessageDto, subdomainId: string) {
        const subdomainUrl = await getSubdomainUrl(this.db, subdomainId);

        const _emailHelper = new SendEmailHelper();
        const templatePath = join(
            __dirname,
            './../../../client/html/wrapper-template.html'
        );
        const orientationPath = join(
            __dirname,
            './../../../client/html/contact-message.html'
        );

        const body = _emailHelper.buildStringTemplate(orientationPath, {
            name, email, message
        });

        _emailHelper.send(
            process.env.SENDGRID_EMAIL_FROM,
            subject,
            templatePath,
            {
                body,
                email: process.env.SENDGRID_EMAIL_FROM,
                year: new Date().getFullYear(),
                subdomain: subdomainUrl,
            }
        );
        return true;
    }
}
