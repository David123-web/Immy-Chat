import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { PaginationSortDto } from 'src/common/dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { CampusRoomService } from './campus-rooms.service';

@Injectable()
export class CampusesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly roomService: CampusRoomService
    ) {}
    async create(
        subdomainId: string,
        { countryCode, rooms, ...data }: CreateCampusDto
    ) {
        //TODO: Check with availability to create campus and rooms
        const createdCampus = await this.prisma.campus.create({
            data: {
                subdomain: {
                    connect: {
                        id: subdomainId,
                    },
                },
                country: countryCode
                    ? {
                        connect: {
                            code: countryCode,
                        },
                    }
                    : undefined,
                ...data,
            },
        });

        const createRoomsPromises = rooms.map(async (room) => {
            room.campusId = createdCampus.id;
            return this.roomService.create(subdomainId, room);
        });

        await Promise.all(createRoomsPromises);
        return HttpStatus.CREATED;
    }

    async findOne(subdomainId: string, id: string, withDeleted = false) {
        const campus = await this.prisma.campus.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                rooms: true,
            },
        });
        if (
            !campus ||
            campus.subdomainId !== subdomainId ||
            (withDeleted ? false : campus.isDeleted)
        )
            throw new NotFoundException('Campus not found!');
        return campus;
    }

    async findAll(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc, isDeleted }: PaginationSortDto
    ) {
        const [data, total] = await Promise.all([
            this.prisma.campus.findMany({
                skip,
                take,
                cursor: cursorId && {
                    id: cursorId,
                },
                where: {
                    subdomainId,
                    isDeleted: false,
                },
                orderBy: sortBy && {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                },
            }),
            this.prisma.campus.count({
                where: {
                    subdomainId,
                    isDeleted: false,
                },
            }),
        ]);

        return {
            data,
            total,
        };
    }

    async update(subdomainId: string, id: string, data: UpdateCampusDto) {
        await this.findOne(subdomainId, id);
        await this.prisma.campus.update({
            where: {
                id,
            },
            data,
        });
        return true;
    }

    async restore(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id, true);
        await this.prisma.campus.update({
            where: {
                id,
            },
            data: {
                isDeleted: false,
            },
        });
        return true;
    }

    async remove(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id);
        await this.prisma.campus.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        return true;
    }

    async permanentRemove(subdomainId: string, id: string) {
        await this.findOne(subdomainId, id);
        await this.prisma.campus.delete({
            where: {
                id,
            },
        });
        return true;
    }
}
