import {Controller,
    Get,
    Body,
    Patch,
    UseGuards,
    Req,
    Param,
    Post,
    Delete,
    Query,} from '@nestjs/common';
import { SubdomainSettingsService } from './subdomain-settings.service';
import { UpdateSubdomainSettingDto } from './dto/update-subdomain-setting.dto';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EmailTemplateType, Role } from '@prisma/client';
import { UpdateSubdomainThemeDto } from './dto/update-subdomain-theme.dto';
import { UpdateSubdomainInfoDto } from './dto/update-subdomain-info.dto';
import {AddSubdomainSocialLinkDto,
    UpdateSubdomainSocialLinkDto,} from './dto/subdomain-social-link.dto';
import { UpdateSubdomainEmailSMTPDto } from './dto/update-subdomain-email.dto';
import { SendMailTestDto } from './dto/send-mail-test.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { PaginationDto } from 'src/common/dto';
import { SubdomainHeader } from 'src/helpers/common';
import { UpdateSubdomainCreditValueDto } from './dto/update-subdomain-creditvalue.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('subdomain-settings')
@Controller('subdomain-settings')
@ApiHeader(SubdomainHeader)
export class SubdomainSettingsController {
    constructor(
        private readonly subdomainSettingsService: SubdomainSettingsService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Get all subdomain settings',
    })
    @Get()
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    get(@Req() req: any) {
        return this.subdomainSettingsService.get(req.subdomainId);
    }

    @ApiResponse({
        status: 200,
        description: 'Get credit value for subdomain',
    })
    @Get('credit-value')
    getCreditValue(@Req() req: any) {
        return this.subdomainSettingsService.getCreditValue(req.subdomainId);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain settings',
    })
    @Patch()
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    update(
        @Req() req: any,
        @Body() updateSubdomainSettingDto: UpdateSubdomainSettingDto
    ) {
        return this.subdomainSettingsService.update(
            req.subdomainId,
            updateSubdomainSettingDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain theme',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch('theme')
    updateTheme(@Req() req: any, @Body() body: UpdateSubdomainThemeDto) {
        return this.subdomainSettingsService.updateTheme(req.subdomainId, body);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain infomation',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch('info')
    updateInfomation(@Req() req: any, @Body() body: UpdateSubdomainInfoDto) {
        return this.subdomainSettingsService.updateSubdomainInfo(
            req.subdomainId,
            body
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Add subdomain social links',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Post('social-links')
    addSocialLink(@Req() req: any, @Body() body: AddSubdomainSocialLinkDto) {
        return this.subdomainSettingsService.addSocialLink(
            req.subdomainId,
            body
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get subdomain social links',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Get('social-links')
    getSocialLinks(@Req() req: any) {
        return this.subdomainSettingsService.getSocialLinks(req.subdomainId);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain social links',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch('social-links/:id')
    updateSocialLinks(
        @Param('id') id: string,
        @Body() body: UpdateSubdomainSocialLinkDto
    ) {
        return this.subdomainSettingsService.updateSocialLink(id, body);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain credit value',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch('subdomain-credit-value/:id')
    updateCreditValue(
        @Param('id') subdomainId: string,
        @Body() body: UpdateSubdomainCreditValueDto
    ) {
        
        return this.subdomainSettingsService.updateCreditValue(subdomainId, body);
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain social links',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Delete('social-links/:id')
    deleteSocialLink(@Param('id') id: string) {
        return this.subdomainSettingsService.deleteSocialLink(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get subdomain email smtp settings',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Get('email/smtp')
    getEmailSMTPInfo(@Req() req: any) {
        return this.subdomainSettingsService.getEmailSMTPSettings(
            req.subdomainId
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Update subdomain email smtp',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch('/email/smtp')
    updateEmailSmtp(
        @Req() req: any,
        @Body() body: UpdateSubdomainEmailSMTPDto
    ) {
        return this.subdomainSettingsService.updateEmailSMTPInfo(
            req.subdomainId,
            body
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Send test email',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Post('/email/send-test')
    sendTestEmail(@Req() req: any, @Body() body: SendMailTestDto) {
        return this.subdomainSettingsService.emailSMTPTesting(
            req.subdomainId,
            body
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get email template',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Get('/email/templates')
    getEmailTemplate(@Req() req: any) {
        return this.subdomainSettingsService.getEmailTemplates(req.subdomainId);
    }

    @ApiResponse({
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Get('/email/templates/:type')
    getEmailTemplateByType(
        @Req() req: any,
        @Param('type') type: EmailTemplateType
    ) {
        return this.subdomainSettingsService.getEmailTemplateByType(
            req.subdomainId,
            type
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Update email template',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Patch('/email/templates/:type')
    updateEmailTemplate(
        @Req() req: any,
        @Param('type') type: EmailTemplateType,
        @Body() body: UpdateEmailTemplateDto
    ) {
        return this.subdomainSettingsService.updateEmailTemplate(
            req.subdomainId,
            type,
            body
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get email log',
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Get('/email/log')
    getEmailLog(@Req() req: any, @Query() query: PaginationDto<any>) {
        return this.subdomainSettingsService.getEmailLogs(
            req.subdomainId,
            query
        );
    }
}
