import {Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleAccessGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const accessKey = this.reflector.get<string>(
            'accessKey',
            context.getHandler()
        );

        if (!accessKey) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return false;
    }
}

export const RoleAccess = (accessKey: string) =>
    SetMetadata('accessKey', accessKey);
