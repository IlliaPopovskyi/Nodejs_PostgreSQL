import { EMode } from './enums';
import { IConfig } from './interfaces';

require('dotenv').config();

const config: IConfig = {
	server: {
		port: +process.env.SERVER_PORT,
		mode: process.env.MODE as keyof typeof EMode,
	},
	jwt: {
		accessSecret: process.env.ACCESS_SECRET,
		refreshSecret: process.env.REFRESH_SECRET,
		verifySecret: process.env.VERIFY_SECRET,
	},
	mailer: {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		refreshToken: process.env.MAILER_REFRESH_TOKEN,
		clientId: process.env.MAILER_CLIENT_ID,
		clientSecret: process.env.MAILER_CLIENT_SECRET,
		user: process.env.MAILER_EMAIL,
	},
};

export default config;
