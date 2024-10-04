import { Injectable, NotFoundException } from '@nestjs/common';
import { use } from 'passport';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSubdomainSettingDto } from './dto/update-subdomain-setting.dto';
import { UpdateSubdomainThemeDto } from './dto/update-subdomain-theme.dto';
import { UpdateSubdomainInfoDto } from './dto/update-subdomain-info.dto';
import {AddSubdomainSocialLinkDto,
    UpdateSubdomainSocialLinkDto,} from './dto/subdomain-social-link.dto';
import { UpdateSubdomainEmailSMTPDto } from './dto/update-subdomain-email.dto';
import * as nodemailer from 'nodemailer';
import { SendMailTestDto } from './dto/send-mail-test.dto';
import { EmailTemplateType } from '@prisma/client';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { SubdomainMailSMTPHelper } from 'src/helpers/subdomain-smtp-mail.helper';
import { UpdateSubdomainCreditValueDto } from './dto/update-subdomain-creditvalue.dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class SubdomainSettingsService {
    constructor(private readonly prisma: PrismaService) { }
    async get(subdomainId: string) {
        const subdomainSetting = await this.prisma.subdomainSetting.findUnique({
            where: {
                subdomainId,
            },
        });

        if (!subdomainSetting) throw new NotFoundException();

        const parsedSocialLinks = JSON.parse(subdomainSetting?.socialLinks);
        const parsedSupportLinks = JSON.parse(subdomainSetting?.supportLinks);

        return {
            ...subdomainSetting,
            socialLinks: parsedSocialLinks,
            supportLinks: parsedSupportLinks,
        };
    }

    async update(
        subdomainId: string,
        updateSubdomainSettingDto: UpdateSubdomainSettingDto
    ) {
        await this.prisma.subdomainSetting.upsert({
            create: {
                ...updateSubdomainSettingDto,
                socialLinks: JSON.stringify(
                    updateSubdomainSettingDto.socialLinks
                ),
                supportLinks: JSON.stringify(
                    updateSubdomainSettingDto.supportLinks
                ),
                subdomainId,
            },
            update: {
                ...updateSubdomainSettingDto,
                socialLinks: updateSubdomainSettingDto.socialLinks ? JSON.stringify(
                    updateSubdomainSettingDto.socialLinks
                ) : undefined,
                supportLinks: updateSubdomainSettingDto.supportLinks ? JSON.stringify(
                    updateSubdomainSettingDto.supportLinks
                ) : undefined,
            },
            where: {
                subdomainId,
            },
        });
        return true;
    }

    async getCreditValue(subdomainId: string) {
        const subdomainSettings = await this.get(subdomainId);
        return {
            creditValue: subdomainSettings.creditValue,
            currency: subdomainSettings.currency,
            id: subdomainSettings.id
        };
    }

    async updateTheme(subdomainId: string, body: UpdateSubdomainThemeDto) {
        const subdomain = await this.prisma.subdomain.findUnique({
            where: {
                id: subdomainId,
            },
        });

        if (!subdomain) throw new NotFoundException('Subdomain doesn\'t exist');

        if (subdomain.subdomainThemeId) {
            const result = await this.prisma.subdomainTheme.update({
                data: {
                    ...body,
                },
                where: {
                    id: subdomain.subdomainThemeId,
                },
            });

            return result;
        } else {
            const result = await this.prisma.subdomainTheme.create({
                data: {
                    ...body,
                },
            });

            await this.prisma.subdomain.update({
                where: {
                    id: subdomainId,
                },
                data: {
                    subdomainThemeId: result.id,
                },
            });

            return result;
        }
    }

    async updateSubdomainInfo(
        subdomainId: string,
        body: UpdateSubdomainInfoDto
    ): Promise<UpdateSubdomainInfoDto> {
        const subdomain = await this.prisma.subdomain.update({
            data: {
                title: body.title,
            },
            where: {
                id: subdomainId,
            },
        });

        const subdomainSetting = await this.prisma.subdomainSetting.upsert({
            update: {
                email: body.email,
                contactNumber: body.contactNumber,
                address: body.address,
            },
            create: {
                email: body.email,
                contactNumber: body.contactNumber,
                address: body.address,
                subdomainId,
            },
            where: {
                subdomainId,
            },
        });

        return {
            title: subdomain.title,
            email: subdomainSetting.email,
            contactNumber: subdomainSetting.contactNumber,
            address: subdomainSetting.address,
        };
    }

    async getSocialLinks(subdomainId: string) {
        return this.prisma.subdomainSocialLink.findMany({
            where: {
                subdomainId,
            },
            select: {
                icon: true,
                url: true,
                order: true,
                id: true,
            },
            orderBy: {
                order: 'asc',
            },
        });
    }

    async addSocialLink(subdomainId: string, body: AddSubdomainSocialLinkDto) {
        return this.prisma.subdomainSocialLink.create({
            data: {
                ...body,
                subdomainId,
            },
        });
    }

    async updateSocialLink(id: string, body: UpdateSubdomainSocialLinkDto) {
        const socialLink = await this.prisma.subdomainSocialLink.findUnique({
            where: {
                id,
            },
        });

        if (!socialLink) throw new NotFoundException();

        return this.prisma.subdomainSocialLink.update({
            where: {
                id,
            },
            data: {
                ...body,
            },
        });
    }

    async updateCreditValue(subdomainId: string, body: UpdateSubdomainCreditValueDto) {
        
        const subdomain = await this.prisma.subdomain.findUnique({
            where: {
                id: subdomainId,
            },
        });

        if (!subdomain) throw new NotFoundException();

        return this.prisma.subdomainSetting.update({
            where: {
                subdomainId: subdomainId
            },
            data: {
                ...body,
            },
        });
    }

    async deleteSocialLink(id: string) {
        const socialLink = await this.prisma.subdomainSocialLink.findUnique({
            where: {
                id,
            },
        });

        if (!socialLink) throw new NotFoundException();

        await this.prisma.subdomainSocialLink.delete({
            where: {
                id,
            },
        });

        return true;
    }

    async updateEmailSMTPInfo(
        subdomainId: string,
        body: UpdateSubdomainEmailSMTPDto
    ) {
        const subdomain = await this.prisma.subdomain.findUnique({
            where: {
                id: subdomainId,
            },
        });

        if (!subdomain) throw new NotFoundException();

        const data = {
            emailFrom: body.fromEmail,
            emailName: body.fromName,
            emailSMTPHost: body.host,
            emailSMTPSecure: body.secure,
            emailSMTPPort: body.port,
            emailSMTPAuth: body.authenticate,
            emailSMTPUsername: body.username,
            emailSMTPPassword: body.password,
        };

        const emailInfoSetting = await this.prisma.subdomainSetting.upsert({
            update: {
                ...data,
            },
            create: {
                ...data,
                subdomainId,
            },
            where: {
                subdomainId: subdomainId,
            },
            select: {
                emailFrom: true,
                emailName: true,
                emailSMTPHost: true,
                emailSMTPSecure: true,
                emailSMTPPort: true,
                emailSMTPAuth: true,
                emailSMTPUsername: true,
                emailSMTPPassword: true,
            },
        });

        return emailInfoSetting;
    }

    async emailSMTPTesting(subdomainId: string, body: SendMailTestDto) {
        const smtpHelper = new SubdomainMailSMTPHelper(this.prisma, subdomainId);

        return smtpHelper.sendMailSMTP({
            emailBody: body.message,
            emailSubject: body.subject,
            emailTo: body.to,
        });
    }

    async getEmailSMTPSettings(subdomainId: string) {
        const subdomainSetting = await this.prisma.subdomainSetting.findUnique({
            where: {
                subdomainId,
            },
            select: {
                emailFrom: true,
                emailName: true,
                emailSMTPHost: true,
                emailSMTPSecure: true,
                emailSMTPPort: true,
                emailSMTPAuth: true,
                emailSMTPUsername: true,
                emailSMTPPassword: true,
            },
        });

        if (!subdomainSetting) {
            throw new NotFoundException('Email SMTP settings not found');
        }

        const emailSMTPPasswordLength =
            subdomainSetting.emailSMTPPassword.length;
        subdomainSetting.emailSMTPPassword = undefined;

        return {
            ...subdomainSetting, emailSMTPPasswordLength
        };
    }

    async getEmailTemplates(subdomainId: string) {
        const emailTemplateTypes = Object.values(EmailTemplateType);

        const emailTemplates = await this.prisma.emailTemplate.findMany({
            where: {
                subdomainId,
            },
        });

        const results = emailTemplateTypes.map((type) => {
            return {
                type,
                id:
                    emailTemplates.find((template) => template.type === type)
                        ?.id || null,
                subject:
                    emailTemplates.find((template) => template.type === type)
                        ?.subject || null,
                content:
                    emailTemplates.find((template) => template.type === type)
                        ?.content || null,
            };
        });

        return results;
    }

    async updateEmailTemplate(
        subdomainId: string,
        type: EmailTemplateType,
        body: UpdateEmailTemplateDto
    ) {
        const emailTemplate = await this.prisma.emailTemplate.findFirst({
            where: {
                subdomainId,
                type,
            },
        });

        if (!emailTemplate) {
            const newEmailTemplate = await this.prisma.emailTemplate.create({
                data: {
                    ...body,
                    subdomainId,
                    type,
                },
            });

            return newEmailTemplate;
        }

        return this.prisma.emailTemplate.update({
            where: {
                id: emailTemplate.id,
            },
            data: {
                ...body,
            },
        });
    }

    async getEmailTemplateByType(subdomainId: string, type: EmailTemplateType) {
        const emailTemplate = await this.prisma.emailTemplate.findFirst({
            where: {
                type,
                subdomainId,
            },
        });

        return emailTemplate;
    }

    async getEmailLogs(subdomainId: string, paging: PaginationDto<any>) {
        const data = await this.prisma.emailSMTPLog.findMany({
            where: {
                subdomainId,
            },
            skip: paging.skip,
            take: paging.take,
        });

        const total = await this.prisma.emailSMTPLog.count({
            where: {
                subdomainId,
            },
        });

        return {
            data,
            total,
        };
    }
}
