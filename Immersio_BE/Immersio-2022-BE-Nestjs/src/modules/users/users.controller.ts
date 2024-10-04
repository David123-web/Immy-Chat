import {Body,
    Controller,
    FileTypeValidator,
    Get,
    HttpException,
    HttpStatus,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import ApproveInstructorDto from './dto/apporve-instructor.dto';
import ChangeInstructorOrTutorProfileDto from './dto/change-instructor-or-tutor-profile.dto';
import ChangeProfileDto from './dto/change-profile.dto';
import FindInstructorDto from './dto/find-instructor-dto';
import FindUserDto from './dto/find-user.dto';
import SelfChangePasswordDto from './dto/self-change-password';
import { UpdateUserDto } from './dto/update-user-dto';
import VerifyDto from './dto/verify.dto';
import { UsersService } from './users.service';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('users')
@Controller('users')
@ApiHeader(SubdomainHeader)
export class UsersController {
    
    constructor(private readonly usersService: UsersService) {  }

    @ApiResponse({
        status: 200,
        description: 'Get all instructors.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/instructors')
    getAllInstructors(@Req() req, @Query() dto: FindInstructorDto) {
        return this.usersService.findAllInstructors(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all instructors for public.'
    })
    @Get('/instructors/public')
    getAllInstructorsPublic(@Req() req, @Query() dto: FindInstructorDto) {
        return this.usersService.findAllInstructorsPublic(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all tutors for public.'
    })
    @Get('/tutors/public')
    getAllTutorsPublic(@Req() req, @Query() dto: FindInstructorDto) {
        return this.usersService.findAllTutorsPublic(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all users.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    find(@Query() dto: FindUserDto) {
        return this.usersService.find(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get current user.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    getOwnInfo(@Request() req) {
        return this.usersService.getUserDetail(req.user.id);
    }

    @ApiResponse({
        status: 200,
        description: 'Upload avatar.'
    })
    @Post('avatar/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5000000,
            },
            fileFilter: (req: any, file: any, cb: any) => {
                if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    cb(null, true);
                } else {
                    cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
                }
            },
        })
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    uploadAvatar(
        @UploadedFile()
            file: Express.Multer.File
    ) {
        return this.usersService.uploadAvatar(file);
    }

    @ApiResponse({
        status: 200,
        description: 'Change profile.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    changeProfile(@Request() req, @Body() dto: ChangeProfileDto) {
        return this.usersService.changeProfile(req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Change password.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('password')
    changePassword(@Request() req: any, @Body() dto: SelfChangePasswordDto) {
        return this.usersService.changePassword(req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get current user.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/user-credits')
    getUserCredits(@Request() req) {
        return this.usersService.getUserCredits(req.user.id);
    }

    @ApiResponse({
        status: 200,
        description: 'Verify account.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Put('verify')
    verifyAccount(@Req() req, @Body() dto: VerifyDto) {
        return this.usersService.verify(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get user detail.'
    })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserDetail(@Param('id') id: string) {
        return this.usersService.getUserDetail(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update user.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Change instructor or tutor profile.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.INSTRUCTOR, Role.TUTOR)
    @Post('profile/instructor')
    changeInstructorOrTutorProfile(@Request() req: any, @Body() dto: ChangeInstructorOrTutorProfileDto) {
        return this.usersService.changeInstructorOrTutorProfile(req.user, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Approve instructor.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @Post('profile/instructor/approve')
    approveInstructor(@Request() req: any, @Body() dto: ApproveInstructorDto) {
        return this.usersService.approveInstructor(dto, req.subdomainId);
    }
}
