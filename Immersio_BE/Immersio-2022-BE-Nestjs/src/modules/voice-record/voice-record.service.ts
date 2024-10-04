import {ForbiddenException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { Role, VoiceRecordType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddVoiceRecordDto } from './dto/add-voice-record.dto';
import { GetListRecordsDto } from './dto/get-list-record.dto';

@Injectable()
export class VoiceRecordService {
    constructor(private readonly prisma: PrismaService) {}

    async getListRecords(userId: string, role: Role, query: GetListRecordsDto) {
        let dialogLines = await this.prisma.dialogLine.findMany({
            where: {
                dialogId: query.dialogId,
            },
            select: {
                content: true,
                id: true,
                dialog: {
                    select: {
                        lesson: {
                            select: {
                                user: {
                                    select: {
                                        profile: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                id: true,
                                            },
                                        },
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
                voiceRecords: {
                    where: {
                        OR: [
                            {
                                userId: userId,
                            },
                            {
                                sendToUserId: query.sendToUserId,
                            },
                        ],
                    },
                    select: {
                        user: {
                            select: {
                                email: true,
                                id: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        type: true,
                        fileId: true,
                        feedback: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                        sendToUserId: true,
                    },
                },
            },
        });

        dialogLines = dialogLines.map((d) => {
            (d as any).instructor = {
                firstName: d.dialog.lesson.user.profile.firstName,
                lastName: d.dialog.lesson.user.profile.lastName,
                id: d.dialog.lesson.user.profile.id,
                email: d.dialog.lesson.user.email,
            };

            (d.voiceRecords as any) = d.voiceRecords;

            delete d.dialog;
            return d;
        });

        return dialogLines;
    }

    async addRecord(userId: string, role: Role, body: AddVoiceRecordDto) {
        let feedback = undefined;
        if (
            body.type === VoiceRecordType.FEEDBACK &&
            (role === Role.INSTRUCTOR || role === Role.TUTOR)
        ) {
            feedback = body.feedback;
        }

        const voiceRecord = await this.prisma.voiceRecord.create({
            data: {
                sendToUserId: body.sendToUserId,
                type: body.type,
                dialogLineId: body.dialogLineId,
                fileId: body.fileId,
                feedback,
                userId,
            },
        });

        return voiceRecord;
    }

    async getDetailRecord(userId: string, id: string) {
        const record = await this.prisma.voiceRecord.findFirst({
            where: {
                id,
            },
        });

        if (!record) {
            throw new NotFoundException();
        }

        if (record.userId === userId || record.sendToUserId === userId) {
            return record;
        }

        throw new ForbiddenException();
    }

    async deleteRecord(userId: string, id: string) {
        const record = await this.prisma.voiceRecord.findFirst({
            where: {
                id,
            },
        });

        if (!record) {
            throw new NotFoundException();
        }

        if (record.userId === userId) {
            await this.prisma.voiceRecord.delete({
                where: {
                    id,
                },
            });

            return true;
        }

        throw new ForbiddenException();
    }
}
