import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindLogsDto } from './dto/find-logs.dto';

@Injectable()
export class LogsService {
    constructor(private readonly prisma: PrismaService) {}
    async findAll({ skip, take, cursorId }: FindLogsDto) {
        return this.prisma.log.findMany({
            skip,
            take,
            cursor: cursorId && {
                id: cursorId 
            },
        });
    }
}
