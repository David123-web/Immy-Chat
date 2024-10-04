import NextCors from 'nextjs-cors';
import { getCookies, setCookie } from 'cookies-next';

export default async function handler(req: any, res: any) {
	await NextCors(req, res, {
		// Options
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});
	setCookie('accessToken', req.body.token, { req, res, maxAge: 60 * 60 * 24 });
	res.writeHead(302, { Location: req.body.domain });
	res.status(200).json({ data: true });
}
