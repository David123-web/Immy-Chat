import {Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                const args = context.getArgByIndex(0);
                // console.log(args)
                // console.log("body", args["body"]);
                // console.log("url", args["url"]);
                // console.log("method", args["method"]);
                // console.log(Object.keys(context.getArgByIndex(0)));
                // console.log("-----------------------");
                this.prisma.log.create({
                    data: {
                        userId: args['user']?.id ?? undefined,
                        body: JSON.stringify(args['body']),
                        url: args['url'],
                        message: err.message,
                        method: args['method'],
                    },
                });
                return throwError(() => err);
            })
        );
    }
}
