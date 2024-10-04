import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Req,
    UseGuards,
    HttpException,
    HttpStatus,} from '@nestjs/common';
import { Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { StreamableFile } from '@nestjs/common/file-stream';
import {ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoursePaidGuard } from '../auth/course-paid-guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import FindCourseDto from './dto/find-course.dto';
import { InviteCoInstructorDto } from './dto/invite-coinstructor';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { SubdomainHeader } from 'src/helpers/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ImportStep2Dto } from './dto/import-step-2.dto';

@ApiTags('courses')
@Controller('courses')
@ApiHeader(SubdomainHeader)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @ApiResponse({
        status: 200,
        description: 'Returns enum of course types: PAID, WITH_SUBSCRIPTION, FREE ',
    })
    @Get('course-types')
    async getCourseTypes() {
        return await  this.coursesService.getCourseTypes();
    }

    @ApiResponse({
        status: 200,
        description: 'Get all courses published',
    })
    @Get('publish')
    findAllPublish(@Req() req: any, @Query() dto: FindCourseDto) {
        return this.coursesService.findAllPublish(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Create course',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN, Role.INSTRUCTOR)
    create(@Req() req: any, @Body() createCourseDto: CreateCourseDto) {        
        return this.coursesService.create(
            req.subdomainId,
            req.user.id,
            createCourseDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get all courses',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req: any, @Query() dto: FindCourseDto) {
        return this.coursesService.findAll(req.subdomainId, req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get Paid courses',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('paid')
    findPaid(@Req() req: any, @Query() dto: FindCourseDto) {
        return this.coursesService.findPaid(req.subdomainId, req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all courses public',
    })
    @Get('public')
    findAllPublic(@Req() req: any, @Query() dto: FindCourseDto) {
        return this.coursesService.findAllPublic(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Invite co-instructor to course',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('co-instructor/invite')
    inviteCoInstructor(@Req() req: any, @Body() dto: InviteCoInstructorDto) {
        return this.coursesService.inviteCoInstructor(
            req.user.id,
            req.subdomainId,
            dto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Remove co-instructor from course',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('co-instructor/remove')
    removeCoInstructor(@Req() req: any, @Body() dto: InviteCoInstructorDto) {
        return this.coursesService.removeCoInstructor(req.user.id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Accept co-instructor invitation to course by token',
    })

    @Get('co-instructor/accept/:token')
    acceptCoInstructorInvitation(@Param('token') token: string) {
        return this.coursesService.acceptCoInstructorInvitation(token);
    }

    @ApiResponse({
        status: 200,
        description: 'Reject co-instructor invitation to course by token',
    })
    @Get('co-instructor/reject/:token')
    rejectCoInstructorInvitation(@Param('token') token: string) {
        return this.coursesService.rejectCoInstructorInvitation(token);
    }

    @ApiResponse({
        status: 200,
        description: 'Download courses csv',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('csv')
    async downloadCSV(
        @Req() req: any,
        @Query() dto: FindCourseDto,
        @Res({
            passthrough: true,
        })
            res
    ) {
        const stream = await this.coursesService.downloadCSV(
            req.subdomainId,
            req.user.id,
            dto
        );
        res.set({
            'Content-Disposition': 'attachment; filename=courses.csv',
        });
        return new StreamableFile(stream);
    }

    @ApiResponse({
        status: 200,
        description: 'Check course permission by id',
    })
    @Get(':id/permission/public')
    checkPublicPermission(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.checkPublicPermission(+id);
    }

    @Get(':id/permission')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    checkPermission(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.checkPermission(req.user.id, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get public details course by id',
    })
    @Get(':id/public')
    @UseGuards(JwtAuthGuard, CoursePaidGuard)
    findOnePublic(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.findOne(req.subdomainId, null, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get details course by id',
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.findOne(req.subdomainId, req.user.id, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update course by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUBDOMAIN_ADMIN, Role.SUPER_ADMIN, Role.INSTRUCTOR)
    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateCourseDto: UpdateCourseDto
    ) {
        return this.coursesService.update(req.user.id, +id, updateCourseDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Recycle course by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id/recycle')
    recycle(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.recycle(req.user.id, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Permanent delete course by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id/permanent')
    permanentDelete(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.permanentDelete(req.user.id, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete course by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.coursesService.remove(req.user.id, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Imports course step 1',
    })
    @Post('import/step-1')
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
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.INSTRUCTOR)
    importCourseStep1(
        @Req() req: any,
        @UploadedFile()
            file: Express.Multer.File
    ) {
        return this.coursesService.importCourseStep1(
            req.subdomainId,
            req.user.id,
            file
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Imports course step 2',
    })
    @Post('import/step-2')
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
                courseId: {
                    type: 'number',
                    format: 'int64',
                },
            },
        },
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.INSTRUCTOR)
    importCourseStep2(
        @Req() req: any,
        @UploadedFile()
            file: Express.Multer.File,
        @Body() body: ImportStep2Dto
    ) {
        return this.coursesService.importCourseStep2(
            req.subdomainId,
            req.user.id,
            file,
            body.courseId
        );
    }
}
