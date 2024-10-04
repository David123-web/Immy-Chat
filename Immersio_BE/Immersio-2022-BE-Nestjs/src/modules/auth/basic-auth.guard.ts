import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { basicConstants } from './constants';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return false;
    }
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const enteredPassword = auth[1];
    try {
      const result = await bcrypt.compare(enteredPassword, basicConstants.saltedImmyAPIPassword);
      return result;
    } catch (error) {
      throw new UnauthorizedException('Password has error:', error.message);
    }
  }
}
