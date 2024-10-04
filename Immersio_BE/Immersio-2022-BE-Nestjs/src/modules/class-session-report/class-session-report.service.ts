import {HttpStatus,
    Injectable,
    InternalServerErrorException,} from '@nestjs/common';
import { CreateClassSessionReportDto } from './dto/create-class-session-report.dto';
import { UpdateClassSessionReportDto } from './dto/update-class-session-report.dto';
import { PrismaService } from '../prisma/prisma.service';
import FindClassSessionReportDto from './dto/find-class-session-report.dto';

@Injectable()
export class ClassSessionReportService {
    constructor(private readonly prisma: PrismaService) {}
    async create(
        subdomainId: string,
        createClassSessionReportDto: CreateClassSessionReportDto
    ) {
        const createdReport = await this.prisma.classSessionReport.create({
            data: {
                subdomainId,
                ...createClassSessionReportDto,
            },
        });

        if (!createdReport)
            throw new InternalServerErrorException(
                'Can not create class session report'
            );

        return HttpStatus.CREATED;
    }

    findAll(
        subdomainId: string,
        { sortBy, sortDesc, skip, take, cursorId }: FindClassSessionReportDto
    ) {
        return this.prisma.classSessionReport.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId,
            },
            where: {
                subdomainId,
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc',
            },
        });
    }

    findOne(id: string) {
        return this.prisma.classSessionReport.findUnique({
            where: {
                id: id,
            },
        });
    }

    update(
        id: number,
        updateClassSessionReportDto: UpdateClassSessionReportDto
    ) {
        return `This action updates a #${id} classSessionReport`;
    }

    remove(id: number) {
        return `This action removes a #${id} classSessionReport`;
    }
}
