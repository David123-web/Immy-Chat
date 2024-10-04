import {ForbiddenException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationSortDto } from 'src/common/dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AvailableTimeService } from '../available-time/available-time.service';
import { AvailableTimeDto } from '../available-time/dto/available-time.dto';

@Injectable()
export class CampusRoomService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly availableService: AvailableTimeService
    ) {}
    async create(
        subdomainId: string,
        {
            campusId,
            deleteAvailableTimeIds,
            availableTimes,
            ...data
        }: CreateRoomDto
    ) {
        //TODO: Check with availability to create room
        const campus = await this.prisma.campus.findUnique({
            where: {
                id: campusId,
            },
        });
        if (!campus || campus.subdomainId !== subdomainId)
            throw new NotFoundException('Campus not found!');
        const foundRoom = await this.prisma.room.findFirst({
            where: {
                campus: {
                    id: campus.id,
                },
                roomId: data.roomId,
            },
        });

        if (foundRoom) throw new ForbiddenException('Room is already existed');

        const createdRoom = await this.prisma.room.create({
            data: {
                campus: {
                    connect: {
                        id: campus.id,
                    },
                },
                roomId: data.roomId,
            },
        });

        if (!createdRoom) throw new InternalServerErrorException();

        return this.createAvailableTimeForRoom(createdRoom.id, {
            availableTimes,
            deleteAvailableTimeIds,
        });
    }

    async createAvailableTimeForRoom(
        id: string,
        {
            availableTimes,
            deleteAvailableTimeIds: deleteIds,
        }: {
            availableTimes: AvailableTimeDto[];
            deleteAvailableTimeIds: number[];
        }
    ) {
        await this.prisma.repeat.deleteMany({
            where: {
                availableTimeId: {
                    in: deleteIds,
                },
            },
        });

        await this.prisma.availableTime.deleteMany({
            where: {
                AND: {
                    room: {
                        id: id,
                    },
                    id: {
                        in: deleteIds,
                    },
                },
            },
        });

        const _promises = availableTimes.map(({ repeat, ...availableTime }) =>
            this.prisma.availableTime.create({
                data: {
                    ...availableTime,
                    room: {
                        connect: {
                            id: id,
                        },
                    },
                    repeat: repeat
                        ? {
                            create: {
                                ...repeat,
                            },
                        }
                        : undefined,
                },
            })
        );

        await Promise.all(_promises);
        return true;
    }

    async findOne(subdomainId: string, id: string, start: Date, end: Date) {
        const room = await this.prisma.room.findUnique({
            where: {
                id,
            },
            include: {
                campus: {
                    select: {
                        subdomainId: true,
                        isDeleted: false,
                    },
                },
                availableTimes: {
                    where: {
                        room: {
                            id: id,
                        },
                        OR: [
                            {
                                repeat: {
                                    end: {
                                        gte: start,
                                    },
                                },
                            },
                            {
                                repeat: {
                                    end: null,
                                },
                            },
                            {
                                AND: {
                                    repeat: null,
                                    start: {
                                        gte: start,
                                        lte: end,
                                    },
                                },
                            },
                        ],
                    },
                    include: {
                        repeat: true,
                    },
                },
            },
        });

        if (!room || room.campus.subdomainId !== subdomainId)
            throw new NotFoundException('Campus not found!');

        if (room.availableTimes.length > 0) {
            room.availableTimes = this.findAvailableTimes({
                availableTimes: room.availableTimes,
                start: start,
                end: end,
            });
        }
        return room;
    }

    findAvailableTimes({
        availableTimes,
        start,
        end,
    }: {
        availableTimes: AvailableTimeDto[];
        start: Date;
        end: Date;
    }) {
        // get all records that related to user that has repeat.end >= start|| repeat does not have end || does not repeat
        const results = [];
        availableTimes.forEach((t) => {
            if (!t.repeat || t.repeat == null) {
                results.push(t);
                return;
            }
            const repeatedDays = this.availableService.generateRepeatedDays({
                eventData: {
                    ...t,
                },
                startBound: start,
                endBound: end,
            });
            results.push(...repeatedDays);
        });
        return results;
    }

    async findAll(
        subdomainId: string,
        { skip, take, cursorId, sortBy, sortDesc }: PaginationSortDto
    ) {
        return this.prisma.room.findMany({
            skip,
            take,
            where: {
                campus: {
                    subdomainId,
                    isDeleted: false,
                },
            },
            include: {
                campus: true,
            },
            cursor: cursorId && {
                id: cursorId,
            },
            orderBy: sortBy && {
                [sortBy]: sortDesc ? 'desc' : 'asc',
            },
        });
    }

    async findRoomById(subdomainId: string, id: string) {
        const found = await this.prisma.room.findFirst({
            where: {
                id,
                campus: {
                    subdomainId: subdomainId,
                },
            },
        });

        return found;
    }

    async update(
        subdomainId: string,
        id: string,
        {
            campusId,
            deleteAvailableTimeIds,
            availableTimes,
            ...data
        }: UpdateRoomDto
    ) {
        const foundRoom = await this.findRoomById(subdomainId, id);
        if (!foundRoom) throw new NotFoundException('Room not found!');

        if (foundRoom.roomId === data.roomId && foundRoom.id !== id)
            throw new ForbiddenException('Room is already existed');

        const updatedRoom = await this.prisma.room.update({
            data: {
                campus: {
                    connect: {
                        id: campusId,
                    },
                },
                ...data,
            },
            where: {
                id,
            },
        });

        if (!updatedRoom) throw new InternalServerErrorException();

        return this.createAvailableTimeForRoom(updatedRoom.id, {
            availableTimes,
            deleteAvailableTimeIds,
        });
    }

    async remove(id: string) {
        await this.prisma.room.delete({
            where: {
                id,
            },
        });
        return true;
    }
}
