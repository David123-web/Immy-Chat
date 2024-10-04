import { NotFoundException } from '@nestjs/common';
import { EmailTemplateType, PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { verifyEmailTemplateInit } from 'src/constants/mail-templates-initital';

type SubdomainContext = {
    website_title: string;
};

type CommonContext = SubdomainContext & {
    first_name: string;
    last_name: string;
};

type VerifyEmailContext = CommonContext & {
    verification_link: string;
};

type MailInfo = {
    emailTo: string;
    emailSubject: string;
    emailBody: string;
    type?: EmailTemplateType;
};

export class SubdomainMailSMTPHelper {
    subdomainContext: SubdomainContext;

    constructor(
        private readonly prisma: PrismaClient,
        private subdomainId: string
    ) {}

    private _buildStringTemplate<T = Record<string, any>>(
        template: string,
        data: T
    ): string {
        return template.replace(/{{([^{}]+)}}/g, function (_, key) {
            return data[key] || '';
        });
    }

    private async _setSubdomainContext() {
        const subdomain = await this.prisma.subdomain.findFirst({
            where: {
                id: this.subdomainId,
            },
        });

        this.subdomainContext = {
            website_title: subdomain.title,
        };
    }

    async sendMailSMTP(info: MailInfo) {
        try {
            const subdomainSetting =
                await this.prisma.subdomainSetting.findUnique({
                    where: {
                        subdomainId: this.subdomainId,
                    },
                });

            if (!subdomainSetting) {
                throw new NotFoundException('Subdomain doesn\'t exist');
            }

            if (
                !subdomainSetting.emailFrom ||
                !subdomainSetting.emailName ||
                !subdomainSetting.emailSMTPAuth ||
                !subdomainSetting.emailSMTPUsername ||
                !subdomainSetting.emailSMTPPassword ||
                !subdomainSetting.emailSMTPHost ||
                !subdomainSetting.emailSMTPPort
            ) {
                throw new NotFoundException('Email SMTP settings not found');
            }

            const transporter = nodemailer.createTransport({
                host: subdomainSetting.emailSMTPHost,
                port: subdomainSetting.emailSMTPPort,
                secure:
                    subdomainSetting.emailSMTPSecure === 'None' ? false : true,
                auth: subdomainSetting.emailSMTPAuth
                    ? {
                        user: subdomainSetting.emailSMTPUsername,
                        pass: subdomainSetting.emailSMTPPassword,
                    }
                    : {
                    },
            });

            const result = await transporter.sendMail({
                from: `"${subdomainSetting.emailName}" <${subdomainSetting.emailFrom}>`,
                to: info.emailTo,
                subject: info.emailSubject,
                text: info.emailBody,
            });

            await this.prisma.emailSMTPLog.create({
                data: {
                    subdomainId: this.subdomainId,
                    body: info.emailBody,
                    subject: info.emailSubject,
                    to: info.emailTo,
                    messageId: result.messageId,
                    from: subdomainSetting.emailFrom,
                    type: info.type,
                },
            });

            return {
                success: true,
                message: 'Message sent',
                messageId: result.messageId,
            };
        } catch (err) {
            await this.prisma.emailSMTPLog.create({
                data: {
                    subdomainId: this.subdomainId,
                    body: info.emailBody,
                    subject: info.emailSubject,
                    to: info.emailTo,
                    type: info.type,
                    error: err.message,
                },
            });

            return {
                success: false,
                message: err.message,
            };
        }
    }

    async sendVerifyEmail(emailTo: string, context: VerifyEmailContext) {
        await this._setSubdomainContext();

        const template = await this.prisma.emailTemplate.findFirst({
            where: {
                type: 'VERIFY_EMAIL',
                subdomainId: this.subdomainId,
            },
        });

        let content = template?.content;

        if (!template) {
            content = verifyEmailTemplateInit;
        }

        const data = this._buildStringTemplate<VerifyEmailContext>(content, {
            first_name: context.first_name,
            last_name: context.last_name,
            verification_link: context.verification_link,
            website_title: this.subdomainContext.website_title,
        });

        await this.sendMailSMTP({
            emailTo,
            emailSubject: template?.subject || 'Immersio Verify Email',
            emailBody: data,
        });

        return true;
    }
}
