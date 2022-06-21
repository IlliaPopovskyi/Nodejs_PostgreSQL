import { EMode } from './enums';

interface IServer {
	port: number;
	mode: keyof typeof EMode;
}
interface IJwt {
	accessSecret: string;
	refreshSecret: string;
	verifySecret: string;
}

interface IMailer {
	host: string;
	port: number;
	secure: boolean;
	refreshToken: string;
	clientId: string;
	clientSecret: string;
	user: string;
}

export interface IConfig {
	server: IServer;
	jwt: IJwt;
	mailer: IMailer;
}
