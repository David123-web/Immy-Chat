import {ForbiddenException,
    UnauthorizedException,} from '@nestjs/common/exceptions';
import { HttpService } from '@nestjs/axios';

const http = new HttpService();
export const getFacebookAppToken = async () => {
    const url = `https://graph.facebook.com/oauth/access_token?client_id=${process.env.FB_APP_ID}&client_secret=${process.env.FB_APP_SECRET}&grant_type=client_credentials`;

    const response = await http.axiosRef.get(url);

    try {
        const { access_token } = response.data;
        return access_token;
    } catch (_) {
        throw new ForbiddenException('Can not facebookApp access token');
    }
};

export const verifyFacebookAccessToken = async (inputToken: string) => {
    const appAccessToken = await getFacebookAppToken();
    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${appAccessToken}`;
    const response = await http.axiosRef.get(url);

    try {
        const { app_id } = response.data.data;
        return app_id === process.env.FB_APP_ID;
    } catch (_) {
        throw new UnauthorizedException();
    }
};
