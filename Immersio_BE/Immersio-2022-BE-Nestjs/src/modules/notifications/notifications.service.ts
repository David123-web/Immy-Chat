import {ForbiddenException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import * as firebaseAdmin from 'firebase-admin';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PushNotificationDto } from './dto/push-notification.dto';
import { RegisterNotificationTokenDto } from './dto/register-notification-token.dto';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(`${process.cwd()}/firebase-account.json`);

@Injectable()
export class NotificationsService {
    serviceAccount: any;

    constructor(
        private readonly prisma: PrismaService,
        @InjectKysely() private db: Kysely<DB>
    ) {
        if (!firebaseAdmin.apps.length) {
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
            });
        }
    }

    async create(userId: string, data: CreateNotificationDto) {
        const notification = await this.prisma.notification.create({
            include: {
                user: {
                    include: {
                        notificationTokens: true,
                    },
                },
            },
            data: {
                ...data,
                userId,
            },
        });

        this.push({
            token: notification.user.notificationTokens.map((nt) => nt.token),
            notification: this.getNotificationByType(data.type, {
                title: data.title,
                message: data.body,
                sound: 'default',
            }),
        });
        return notification;
    }

    getNotificationByType(
        type: NotificationType,
        notification: any,
        data?: any
    ) {
        switch (type) {
        case NotificationType.OTHER:
        default:
            return {
                title: notification.title,
                body: notification.message,
            };
        }
    }

    async findAll(userId: string, { skip, take }: PaginationDto<string>) {
        const notifications = await this.db
            .selectFrom('Notification')
            .where('userId', '=', userId)
            .selectAll()
            .offset(skip)
            .limit(take)
            .orderBy('createdAt', 'desc')
            .execute();
        return Promise.all(
            notifications.map(async (n: any) => {
                const { title, body } = this.getNotificationByType(n.type, {
                });
                return {
                    ...n,
                    title,
                    message: body,
                };
            })
        );
    }

    async findOne(id: string) {
        const notification = await this.db
            .selectFrom('Notification')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        if (!notification) throw new NotFoundException();
        return notification;
    }

    async seen(userId: string, ids: string[]) {
        return this.prisma.notification.updateMany({
            where: {
                id: {
                    in: ids,
                },
                userId,
            },
            data: {
                seen: true,
            },
        });
    }

    async remove(userId: string, id: string) {
        const notification = await this.findOne(id);
        if (notification.userId !== userId) throw new ForbiddenException();
        return this.prisma.notification.delete({
            where: {
                id,
            },
        });
    }

    async registerToken(
        userId: string,
        { deviceId, token }: RegisterNotificationTokenDto
    ) {
        const user = await this.db
            .selectFrom('User')
            .where('id', '=', userId)
            .select('id')
            .executeTakeFirst();
        if (!user) throw new NotFoundException();
        await this.prisma.notificationToken.upsert({
            where: {
                userId_deviceId: {
                    userId: user.id,
                    deviceId,
                },
            },
            create: {
                userId,
                deviceId,
                token,
            },
            update: {
                token,
            },
        });

        return true;
    }

    async push({ token, notification, data }: PushNotificationDto) {
        if (!token || token.length < 1) return;

        const tokenFilter: string[] = (token as string[]).filter(
            (t) => t.length > 0
        );

        try {
            if (Array.isArray(tokenFilter)) {
                if (tokenFilter.length > 0) {
                    const result = await firebaseAdmin
                        .messaging()
                        .sendMulticast({
                            tokens: tokenFilter,
                            notification,
                            data,
                        });
                    console.log(result);
                    if (result?.responses[0]?.error)
                        console.log(result.responses[0].error ?? result);
                }
            } else {
                await firebaseAdmin.messaging().send({
                    token: token as string,
                    notification,
                    data,
                });
            }
        } catch (error) {
            console.log(error, 'token:', tokenFilter);
            return {
                error: 'Internal server error!',
            };
        }
    }
}
