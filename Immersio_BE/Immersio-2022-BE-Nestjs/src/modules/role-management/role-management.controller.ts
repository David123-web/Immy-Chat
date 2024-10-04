import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,
    Put,
    UseInterceptors,
    HttpException,
    HttpStatus,
    UploadedFile,} from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { UpdateRoleManagementDto } from './dto/update-role-management.dto';
import {ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationSortDto, SearchParamsDto } from 'src/common/dto';
import { UpdateActiveUserDto } from './dto/update-active-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserSocialDto } from './dto/update-user-social.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import CreateInstructorDto from './dto/create-instructor.dto';
import CreateTutorDto from './dto/create-tutor.dto';
import CreateStudentDto from './dto/create-student.dto';
import CreateCustomerServiceDto from './dto/create-customer-service.dto';
import CreateEditorDto from './dto/create-editor.dto';
import UpdateInstructorDto from './dto/update-instructor.dto';
import UpdateTutorDto from './dto/update-tutor.dto';
import UpdateStudentDto from './dto/update-student.dto';
import UpdateCustomerServiceDto from './dto/update-customer-service.dto';
import UpdateEditorDto from './dto/update-editor.dto';
import UpdateUserStatusDto from './dto/update-user-status.dto';
import { InviteInterviewDto } from './dto/invite-interview.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CreateClassTagDto } from './dto/create-class-tag.dto';
import { UpdateClassTagDto } from './dto/update-class-tag.dto';
import { GetUsersClassTagDto } from './dto/get-users-class-tags.dto';
import { SendVerifyEmailDto } from './dto/send-verify-email.dto';
import { ImportInstructorsDto } from './dto/import-instructor.dto';
import { ImportTutorsDto } from './dto/import-tutors.dto';
import { ImportStudentsDto } from './dto/import-students.dto';

@ApiTags('role-management')
@Controller('role-management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleManagementController {
    constructor(
        private readonly roleManagementService: RoleManagementService
    ) {}

    @Get()
    @ApiResponse({
        description:
            'Asynchronously finds all the role management instances based on the subdomain ID.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    findAll(@Req() req: any) {
        return this.roleManagementService.findAll(req.subdomainId);
    }

    @Get(':id')
    @ApiResponse({
        description:
            'Asynchronously finds and returns the first instance of a role from the database that matches the given ID and subdomainID.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.roleManagementService.findOne(id, req.subdomainId);
    }

    @Patch(':id')
    @ApiResponse({
        description:
            'Asynchronously updates a role with a new value after validating the access.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateRoleManagementDto: UpdateRoleManagementDto
    ) {
        return this.roleManagementService.update(
            id,
            updateRoleManagementDto.value
        );
    }

    @Post('csv')
    @ApiResponse({
        description:
            'Asynchronously parses a CSV file and creates accounts for each row based on role.',
        status: 200,
    })
    @Roles(Role.SUBDOMAIN_ADMIN)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5000000,
            },
            fileFilter: (req: any, file: any, cb: any) => {
                if (file.mimetype.match(/\/(csv)$/)) {
                    cb(null, true);
                } else {
                    cb(
                        new HttpException(
                            `Unsupported file type ${extname(
                                file.originalname
                            )}`,
                            HttpStatus.BAD_REQUEST
                        ),
                        false
                    );
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
        @Req() req: any,
        @UploadedFile()
            file: Express.Multer.File
    ) {
        return this.roleManagementService.csv(req.subdomainId, file);
    }

    @Post('resend-verify-email')
    @ApiResponse({
        description:
            'Resend the verification email to the instructor and tutor with the given ID.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    resendVerifyEmail(@Req() req: any, @Body() body: SendVerifyEmailDto) {
        return this.roleManagementService.resendVerifyEmail(
            req.subdomainId,
            body.userId
        );
    }

    @Post(`user/${Role.INSTRUCTOR}`)
    @ApiResponse({
        description:
            'Creates an instructor with the given data and subdomain ID.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    createInstructor(@Req() req: any, @Body() body: CreateInstructorDto) {
        return this.roleManagementService.createInstructor(
            body,
            req.subdomainId
        );
    }

    @Patch(`user/${Role.INSTRUCTOR}/:id`)
    @ApiResponse({
        description: 'Asynchronously updates the instructor profile of a user.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateInstructor(
        @Param('id') id: string,
        @Body() body: UpdateInstructorDto
    ) {
        return this.roleManagementService.updateInstructor(id, body);
    }

    @Get(`user/${Role.INSTRUCTOR}`)
    @ApiResponse({
        description:
            'Retrieves instructors based on subdomainId and search parameters.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    getUsersOfInstructor(@Query() query: SearchParamsDto, @Req() req: any) {
        return this.roleManagementService.getUsersOfRole(
            'INSTRUCTOR',
            req.subdomainId,
            {
                skip: query.skip,
                take: query.take,
                sortBy: query.sortBy,
                sortDesc: query.sortDesc,
                searchBy: query.searchBy,
                searchKey: query.searchKey,
            }
        );
    }

    @Post(`user/${Role.TUTOR}`)
    @ApiResponse({
        description:
            'Asynchronously creates a tutor with the given information.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    createTutor(@Req() req: any, @Body() body: CreateTutorDto) {
        return this.roleManagementService.createTutor(body, req.subdomainId);
    }

    @Patch(`user/${Role.TUTOR}/:id`)
    @ApiResponse({
        description: 'Updates a tutor\'s profile with the given information.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateTutor(@Param('id') id: string, @Body() body: UpdateTutorDto) {
        return this.roleManagementService.updateTutor(id, body);
    }

    @Get(`user/${Role.TUTOR}`)
    @ApiResponse({
        description:
            'Retrieves tutors based on subdomainId and search parameters.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR)
    getUsersOfTutor(@Query() query: SearchParamsDto, @Req() req: any) {
        return this.roleManagementService.getUsersOfRole(
            'TUTOR',
            req.subdomainId,
            {
                skip: query.skip,
                take: query.take,
                sortBy: query.sortBy,
                sortDesc: query.sortDesc,
                searchBy: query.searchBy,
                searchKey: query.searchKey,
            }
        );
    }

    @Post(`user/${Role.STUDENT}`)
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    @ApiResponse({
        description:
            'Asynchronously creates a student with the given details and subdomain ID',
        status: 200,
    })
    createStudent(@Req() req: any, @Body() body: CreateStudentDto) {
        return this.roleManagementService.createStudent(body, req.subdomainId);
    }

    @Patch(`user/${Role.STUDENT}/:id`)
    @ApiResponse({
        description: 'Asynchronously updates a student\'s information.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateStudent(@Param('id') id: string, @Body() body: UpdateStudentDto) {
        return this.roleManagementService.updateStudent(id, body);
    }

    @Get(`user/${Role.STUDENT}`)
    @ApiResponse({
        description:
            'Retrieves students based on subdomainId and search parameters.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    getUsersOfStudent(@Query() query: SearchParamsDto, @Req() req: any) {
        return this.roleManagementService.getUsersOfRole(
            'STUDENT',
            req.subdomainId,
            {
                skip: query.skip,
                take: query.take,
                sortBy: query.sortBy,
                sortDesc: query.sortDesc,
                searchBy: query.searchBy,
                searchKey: query.searchKey,
            }
        );
    }

    @Post(`user/${Role.CUSTOMER_SERVICE}`)
    @ApiResponse({
        description:
            'Creates a new customer service with the given data for the specified subdomain.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    createCustomerService(
        @Req() req: any,
        @Body() body: CreateCustomerServiceDto
    ) {
        return this.roleManagementService.createCustomerService(
            body,
            req.subdomainId
        );
    }

    @Patch(`user/${Role.CUSTOMER_SERVICE}/:id`)
    @ApiResponse({
        description: 'Updates customer service information for a given user.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateCustomerService(
        @Param('id') id: string,
        @Body() body: UpdateCustomerServiceDto
    ) {
        return this.roleManagementService.updateCustomerService(id, body);
    }

    @Get(`user/${Role.CUSTOMER_SERVICE}`)
    @ApiResponse({
        description:
            'Retrieves customer services based on subdomainId and search parameters.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    getUsersOfCustomerService(
        @Query() query: SearchParamsDto,
        @Req() req: any
    ) {
        return this.roleManagementService.getUsersOfRole(
            'CUSTOMER_SERVICE',
            req.subdomainId,
            {
                skip: query.skip,
                take: query.take,
                sortBy: query.sortBy,
                sortDesc: query.sortDesc,
                searchBy: query.searchBy,
                searchKey: query.searchKey,
            }
        );
    }

    @Post(`user/${Role.EDITOR}`)
    @ApiResponse({
        description:
            'Asynchronously creates an editor with the provided CreateEditorDto and subdomainId.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    createEditor(@Req() req: any, @Body() body: CreateEditorDto) {
        return this.roleManagementService.createEditor(body, req.subdomainId);
    }

    @Patch(`user/${Role.EDITOR}/:id`)
    @ApiResponse({
        description:
            'Asynchronously updates the editor profile of a user with the given ID using the provided data in the request body.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateEditor(@Param('id') id: string, @Body() body: UpdateEditorDto) {
        return this.roleManagementService.updateEditor(id, body);
    }

    @Get(`user/${Role.EDITOR}`)
    @ApiResponse({
        description:
            'Retrieves editors based on subdomainId and search parameters.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.INSTRUCTOR, Role.TUTOR)
    getUsersOfEditor(@Query() query: SearchParamsDto, @Req() req: any) {
        return this.roleManagementService.getUsersOfRole(
            'EDITOR',
            req.subdomainId,
            {
                skip: query.skip,
                take: query.take,
                sortBy: query.sortBy,
                sortDesc: query.sortDesc,
                searchBy: query.searchBy,
                searchKey: query.searchKey,
            }
        );
    }

    @Patch('active/:id')
    @ApiResponse({
        description: 'Sets the active status of a user with the specified id.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    setActiveUser(
        @Param('id') userId: string,
        @Body() body: UpdateActiveUserDto
    ) {
        return this.roleManagementService.setActiveUser(userId, body.isActive);
    }

    @Patch('user-status/:id')
    @ApiResponse({
        description:
            'Updates the status of a user with the given ID and sends an email notification.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateUserStatus(
        @Param('id') userId: string,
        @Body() body: UpdateUserStatusDto
    ) {
        return this.roleManagementService.updateUserStatus(userId, body.status);
    }

    @Post('user')
    @ApiResponse({
        description:
            'Creates a new user and sends an email to set their password.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    createUser(@Req() req: any, @Body() body: CreateUserDto) {
        return this.roleManagementService.createUser(body, req.subdomainId);
    }

    @Patch('user/social/:id')
    @ApiResponse({
        description: 'Updates the social links of a user.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateUserSocial(
        @Param('id') id: string,
        @Body() body: UpdateUserSocialDto
    ) {
        return this.roleManagementService.updateUserSocial(id, body);
    }

    @Delete('user/:id')
    @ApiResponse({
        description: 'Deletes a user with the given ID.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    deleteUser(@Param('id') id: string) {
        return this.roleManagementService.deleteUser(id);
    }

    @Put('user/:id')
    @ApiResponse({
        description:
            'Asynchronously updates a user and returns true if successful.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.roleManagementService.updateUser(id, body);
    }

    @Post('user/invite-interview/:id')
    @ApiResponse({
        description:
            'Asynchronously invites a user for an interview and sends them an email.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN)
    inviteInterview(@Param('id') id: string, @Body() body: InviteInterviewDto) {
        return this.roleManagementService.inviteInterview(id, body);
    }

    @Post('class-tag')
    @ApiResponse({
        description: 'Creates a new class tag.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.CUSTOMER_SERVICE)
    createClassTag(@Req() req: any, @Body() body: CreateClassTagDto) {
        return this.roleManagementService.createClassTag(req.subdomainId, body);
    }

    @Get('class-tag/tags')
    @ApiResponse({
        description: 'Gets a list of class tags.',
        status: 200,
    })
    @Roles(
        Role.SUPER_ADMIN,
        Role.SUBDOMAIN_ADMIN,
        Role.CUSTOMER_SERVICE,
        Role.EDITOR,
        Role.TUTOR,
        Role.INSTRUCTOR
    )
    getClassTags(@Req() req: any, @Query() query: SearchParamsDto) {
        return this.roleManagementService.getClassTags(req.subdomainId, query);
    }

    @Patch('class-tag/:id')
    @ApiResponse({
        description: 'Updates a class tag.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.CUSTOMER_SERVICE)
    updateClassTag(@Param('id') id: string, @Body() body: UpdateClassTagDto) {
        return this.roleManagementService.updateClassTag(id, body);
    }

    @Delete('class-tag/:id')
    @ApiResponse({
        description: 'Deletes a class tag.',
        status: 200,
    })
    @Roles(Role.SUPER_ADMIN, Role.SUBDOMAIN_ADMIN, Role.CUSTOMER_SERVICE)
    deleteClassTag(@Param('id') id: string) {
        return this.roleManagementService.deleteClassTag(id);
    }

    @Get('class-tag/users')
    @ApiResponse({
        description: 'Gets a list of users associated with a class tag.',
        status: 200,
    })
    getClassTagUsers(@Query() query: GetUsersClassTagDto) {
        const { ids } = query;
        return this.roleManagementService.getClassTagUsers(ids);
    }

    @ApiResponse({
        status: 200,
        description: 'Imports instructors.',
    })
    @Post('import/instructors')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5000000,
            },
            fileFilter: (req: any, file: any, cb: any) => {
                if (file.mimetype.match(/\/(csv)$/)) {
                    cb(null, true);
                } else {
                    cb(
                        new HttpException(
                            `Unsupported file type ${extname(
                                file.originalname
                            )}`,
                            HttpStatus.BAD_REQUEST
                        ),
                        false
                    );
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
    @Roles(Role.SUBDOMAIN_ADMIN)
    importInstructors(
        @Req() req: any,
        @UploadedFile()
            file: Express.Multer.File,
        @Query() query: ImportInstructorsDto
    ) {
        return this.roleManagementService.importInstructors(
            req.subdomainId,
            file,
            query
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Imports tutors.',
    })
    @Post('import/tutors')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5000000,
            },
            fileFilter: (req: any, file: any, cb: any) => {
                if (file.mimetype.match(/\/(csv)$/)) {
                    cb(null, true);
                } else {
                    cb(
                        new HttpException(
                            `Unsupported file type ${extname(
                                file.originalname
                            )}`,
                            HttpStatus.BAD_REQUEST
                        ),
                        false
                    );
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
    @Roles(Role.SUBDOMAIN_ADMIN)
    importTutors(
        @Req() req: any,
        @UploadedFile()
            file: Express.Multer.File,
        @Query() query: ImportTutorsDto
    ) {
        return this.roleManagementService.importTutors(
            req.subdomainId,
            file,
            query
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Imports tutors.',
    })
    @Post('import/students')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5000000,
            },
            fileFilter: (req: any, file: any, cb: any) => {
                if (file.mimetype.match(/\/(csv)$/)) {
                    cb(null, true);
                } else {
                    cb(
                        new HttpException(
                            `Unsupported file type ${extname(
                                file.originalname
                            )}`,
                            HttpStatus.BAD_REQUEST
                        ),
                        false
                    );
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
    @Roles(Role.SUBDOMAIN_ADMIN)
    importStudents(
        @Req() req: any,
        @UploadedFile()
            file: Express.Multer.File,
        @Query() query: ImportStudentsDto
    ) {
        return this.roleManagementService.importStudents(
            req.subdomainId,
            file,
            query
        );
    }
}
