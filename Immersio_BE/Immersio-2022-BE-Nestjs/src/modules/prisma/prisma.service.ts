import {Injectable,
    OnModuleInit,
    Scope,} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({
    scope: Scope.DEFAULT,
})
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const prismaOptions = {log: []};

        if (process.env.ENVIRONMENT === 'development') {
            prismaOptions.log = ['query', 'info', 'warn', 'error'];
        } else {
            prismaOptions.log = ['query', 'info', 'warn', 'error'];
        }

        super(prismaOptions);
    }

    async onModuleInit() {
        this.eventListener();
        await this.$connect();
    }

    eventListener() {
        this.$use(async (params, next) => {
            const before = Date.now();
            const result = await next(params);
            const after = Date.now();
            console.log(
                `--> Query ${params.model}.${params.action} took ${after - before}ms`
            );
            if ((process.env.ENVIRONMENT === 'development')) {
                console.log('RESULT:');
                console.log(`${JSON.stringify(result, null, 4)}`);
            }
            
            return result;
        });
    }
}
