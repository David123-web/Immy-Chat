import {Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Redirect,
    Req,} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import RegisterDto from './dto/register.dto';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import VerifyTokenDto from './dto/verify-token.dto';
import ForgotPasswordDto from './dto/forgot-password.dto';
import RequestMagicLoginDto from './dto/request-magic-login.dto';
import { HostName } from './auth.decorator';
import { Throttle } from '@nestjs/throttler';
import VerifyMagicTokenDto from './dto/verify-magic-token.dto';
import ThirdPartyDto from './dto/login-third-party.dto';
import ChangeForgotPasswordDto from './dto/change-forgot-password.dto';
import VerifyEmailDto from './dto/verify-email.dto';
import RegisterInstructorDto from './dto/register-instructor.dto';
import CheckEmailDto from './dto/check-email.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Registers a new user with the given data, under the given subdomainId.',
    })
    @Post('register')
    async register(@Req() req, @Body() dto: RegisterDto) {
        return this.authService.register(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description:
            'Registers an instructor with the given data, under the given subdomainId.',
    })
    @ApiHeader(SubdomainHeader)
    @Post('register/instructor')
    async registerInstructor(@Req() req, @Body() dto: RegisterInstructorDto) {
        return this.authService.registerInstructor(req.subdomainId, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Authenticates a user by email and password under the given subdomainId.',
    })
    @Post('login')
    async login(@Req() req: any, @Body() dto: LoginDto) {
        return this.authService.login(req, dto);
    }

    @ApiResponse({
        status: 200,
        description:
            'Authenticates subdomain admin by email and password under the given subdomainId.',
    })
    @Post('login/subdomain-admin')
    async subdomainAdminLogin(@Req() req: any, @Body() dto: LoginDto) {
        return this.authService.login(req, dto, true);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description: 'Authenticates using third party',
    })
    @Post('login/third-party')
    async loginThirdParty(@Req() req, @Body() dto: ThirdPartyDto) {
        return this.authService._findOrCreate3rdPartyUser(req.subdomainId, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Verifies a user by token and subdomainId under the given subdomainId.',
    })
    @Post('verify')
    async verifyToken(@Body() { accessToken }: VerifyTokenDto) {
        return this.authService.verifyToken(accessToken);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Requests email verification by token and subdomainId under the given subdomainId.',
    })
    @Post('email/verify')
    async requestEmailVerification(@Body() dto: VerifyEmailDto) {
        return this.authService.requestForEmailVerification(dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description: 'Checks if email exists under the given subdomainId.',
    })
    @Post('email/exist')
    async checkEmailExist(@Req() req, @Body() dto: CheckEmailDto) {
        return this.authService.checkEmailExist(req.subdomainId, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Confirms email verification by token and subdomainId under the given subdomainId.',
    })
    @Get('confirm/:token')
    @Redirect('artrendex://', 302)
    async confirmEmailVerification(@Param('token') token: string) {
        return this.authService.confirmEmailVerification(token);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Requests password reset and return token under the given subdomainId.',
    })
    @Post('password/forgot')
    async forgotPassword(@Req() req: any, @Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(req, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Changes password by token and subdomainId under the given subdomainId.',
    })
    @Patch('password/forgot/:token')
    async changeForgotPassword(
        @Param('token') token: string,
        @Body() dto: ChangeForgotPasswordDto
    ) {
        return this.authService.changeForgotPassword(token, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Changes password by token and subdomainId under the given subdomainId.',
    })
    @Patch('password/set/:token')
    async setPassword(
        @Param('token') token: string,
        @Body() dto: ChangeForgotPasswordDto
    ) {
        return this.authService.changeForgotPassword(token, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Requests magic link and return token under the given subdomainId.',
    })
    @Throttle(parseInt(process.env.THIRD_SERVICES_REQ_IN_MIN), 60)
    @Post('magic-link/send')
    async requestMagicLink(@Req() req, @Body() dto: RequestMagicLoginDto) {
        return this.authService.requestMagicLink(req.subdomainId, dto);
    }

    @ApiHeader(SubdomainHeader)
    @ApiResponse({
        status: 200,
        description:
            'Verifies magic link and subdomainId under the given subdomainId.',
    })
    @Post('magic-link/verify')
    async verifyMagicLink(@Body() dto: VerifyMagicTokenDto) {
        return this.authService.verifyMagicToken(dto);
    }
}
