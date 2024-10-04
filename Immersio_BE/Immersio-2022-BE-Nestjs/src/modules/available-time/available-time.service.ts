import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RepeatType, Role } from '@prisma/client';
import { GetAvailableTimeDto } from './dto/get-available-time.dto';
import * as moment from 'moment-timezone';
import { AvailableTimeDto } from './dto/available-time.dto';

const dayOfWeekMap = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
};

@Injectable()
export class AvailableTimeService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        creatorId: string,
        createAvailableTimeDto: CreateAvailableTimeDto
    ) {
        const { userId, availableTimes, deleteIds } = createAvailableTimeDto;
        const _user = await this.findUser(userId);
        const _creator = await this.findUser(creatorId);

        //tutor can not create availability for instructor
        if (
            !_user ||
            !_creator ||
            (_user.role === Role.INSTRUCTOR && _creator.role === Role.TUTOR)
        )
            throw new ForbiddenException();

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
                    user: {
                        id: userId,
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
                    user: {
                        connect: {
                            id: userId,
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
        return HttpStatus.CREATED;
    }

    // Function to generate repeated days
    generateRepeatedDays({ eventData, startBound, endBound }) {
        const repeatedDays = [];
        let currentDate;
        const startMoment = moment(eventData.start);
        const startBoundMoment = moment(startBound);
        const offsetInDays = startBoundMoment.diff(startMoment, 'days');

        const eventOccurrence = eventData.repeat?.occurrence;
        const eventAmount = eventData.repeat?.amount || 1;
        const eventRepeatType = eventData.repeat.type;
        const weekDays = eventData.repeat.dayOfWeeks
            .map((dayOfWeek) => dayOfWeekMap[dayOfWeek])
            .sort();

        //===================Calculate currentDay to push to result list===================
        if (startMoment?.isSameOrAfter(startBound, 'day')) {
            currentDate = startMoment;
        } else {
            // const amount = eventData.repeat?.amount || 1;
            // const offsetInDays = moment(startBound).diff(startMoment, 'days');

            //Calculate start date for each repeat type
            switch (eventRepeatType) {
            case RepeatType.DAY:
                const dayBaseNumber = Math.ceil(offsetInDays / eventAmount);
                currentDate = startMoment.add(
                    eventAmount * dayBaseNumber,
                    'days'
                );
                break;

            case RepeatType.WEEK:
                const offSetInWeeks = Math.ceil(offsetInDays / 7);
                const numberOfWeek = eventAmount / 7; //because in DB amount save as days
                //check if week is multiplier of amount to make sure that week is not skipped
                if (offSetInWeeks % numberOfWeek !== 0) return [];

                currentDate = startMoment.add(offsetInDays, 'days');

            case RepeatType.MONTH:
                const offsetInMonths = moment(endBound).diff(
                    startMoment,
                    'months'
                );

                const newDate = startBoundMoment
                    .clone()
                    .day(startMoment.day());

                const startMomentWeekOfMonth =
                        startMoment.diff(
                            moment(startMoment).startOf('month'),
                            'weeks'
                        ) + 1;

                const newDateMomentWeekOfMonth =
                        newDate.diff(
                            moment(newDate).startOf('month'),
                            'weeks'
                        ) + 1;

                if (
                    newDate.weekday() === startMoment.weekday() &&
                        startMomentWeekOfMonth === newDateMomentWeekOfMonth &&
                        offsetInMonths === eventAmount
                )
                    currentDate = newDate;

                break;
            default:
                break;
            }
        }

        //===================Loop to generate other repeated days===================

        let occurrenceCount = 0;
        let remainOccurrence = 0;
        if (eventRepeatType === RepeatType.DAY) {
            remainOccurrence =
                eventOccurrence - Math.round(offsetInDays / eventAmount);
        } else if (eventRepeatType === RepeatType.WEEK) {
            const occurrenceStartWeek = weekDays.filter(
                (weekDay) => weekDay > startMoment.day() && weekDay <= 7
            ).length; //calculate occurrence at first week

            remainOccurrence =
                eventOccurrence -
                occurrenceStartWeek -
                (Math.round(offsetInDays / eventAmount) - 1) * weekDays.length +
                1; //-1 because not include start week
        } else if (eventRepeatType === RepeatType.MONTH) {
            const offsetInMonths =
                moment(startBound).month() - startMoment.month();
            remainOccurrence =
                eventOccurrence - Math.round(offsetInMonths / eventAmount);
        }

        const endDate =
            eventData.repeat.end !== null
                ? moment(eventData.repeat.end)
                : moment(endBound);

        while (
            currentDate?.isSameOrBefore(endDate, 'day') &&
            (eventOccurrence === 0 ||
                occurrenceCount < remainOccurrence ||
                eventOccurrence === null)
        ) {
            // Check if the current date is not an exception
            if (
                !this.isException(currentDate, eventData.repeat?.dateExceptions)
            ) {
                const { end, ...remain } = eventData;

                const returnDto = {
                    ...remain,
                    start: currentDate.clone().toDate(),
                };

                const validDayCases = eventData.repeat?.type === RepeatType.DAY;
                const validWeekCases =
                    eventData.repeat?.type === RepeatType.WEEK &&
                    weekDays.includes(currentDate.weekday());
                const validMonthCases =
                    eventData.repeat?.type === RepeatType.MONTH;

                const isValidToReturn =
                    validDayCases || validWeekCases || validMonthCases;
                if (isValidToReturn) {
                    repeatedDays.push(returnDto);
                }
                occurrenceCount++;
            }

            // Increment the date based on repetition type
            if (eventData.repeat?.type === 'DAY') {
                currentDate.add(eventAmount, 'day');
            } else if (eventData.repeat?.type === 'WEEK') {
                if (eventData.repeat.dayOfWeeks) {
                    const nextValidDayIndex = weekDays.findIndex(
                        (weekDay) => weekDay > currentDate.weekday()
                    );

                    if (nextValidDayIndex === -1) {
                        currentDate.add(eventAmount, 'days');
                    } else {
                        const diff =
                            weekDays[nextValidDayIndex] - currentDate.weekday();

                        const nextValidDate = currentDate
                            .clone()
                            .add(diff, 'days');

                        currentDate = nextValidDate;
                    }
                } else {
                    currentDate.add(eventAmount, 'days');
                }
            } else if (eventData.repeat?.type === 'MONTH') {
                break;
            } else {
                // Add handling for other repetition types if needed
                // break;
            }
        }
        return repeatedDays;
    }

    // Helper function to check if a date exists in the exceptions list
    isException(date, exceptions) {
        return exceptions.some((exception) => moment(date).isSame(exception));
    }

    async findAll(query: GetAvailableTimeDto) {
        const { start, end, userId } = query;
        // get all records that related to user that has repeat.end >= start|| repeat does not have end || does not repeat
        const availableTimes = await this.prisma.availableTime.findMany({
            where: {
                user: {
                    id: userId,
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
        });

        const results = [];

        availableTimes.forEach((t) => {
            if (!t.repeat || t.repeat == null) {
                results.push(t);
                return;
            }
            const repeatedDays = this.generateRepeatedDays({
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

    findOne(id: number) {
        return `This action returns a #${id} availableTime`;
    }

    update(id: number, updateAvailableTimeDto: UpdateAvailableTimeDto) {
        return `This action updates a #${id} availableTime`;
    }

    remove(id: number) {
        return `This action removes a #${id} availableTime`;
    }

    findUser(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
}
