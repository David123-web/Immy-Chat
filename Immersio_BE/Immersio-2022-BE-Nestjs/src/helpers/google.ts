import {ForbiddenException,
    UnauthorizedException,} from '@nestjs/common/exceptions';
import { HttpService } from '@nestjs/axios';

const http = new HttpService();

export const getGoogleUserId = async (token: string) => {
    const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
    const response = await http.axiosRef.get(url);

    try {
        const { audience, user_id } = response.data;
        if (audience === process.env.GG_APP_ID) return user_id;
        return;
    } catch (_) {
        throw new UnauthorizedException();
    }
};
