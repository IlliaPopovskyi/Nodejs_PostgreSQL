import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

import config from '../config';

const OAuth2Client = new google.auth.OAuth2(
	config.mailer.clientId,
	config.mailer.clientSecret,
);
OAuth2Client.setCredentials({
	refresh_token: config.mailer.refreshToken,
});

export default async (
	recipientMail: string,
	subject: string,
	html?: string,
) => {
	const accessToken = await OAuth2Client.getAccessToken();
	const transporter = nodemailer.createTransport(
		{
			host: config.mailer.host,
			port: config.mailer.port,
			secure: config.mailer.secure,
			auth: {
				type: 'OAuth2',
				clientId: config.mailer.clientId,
				clientSecret: config.mailer.clientSecret,
				user: config.mailer.user,
				refreshToken: config.mailer.refreshToken,
				accessToken: accessToken.token,
			},
		},
		{
			from: `Mailer <${config.mailer.user}>`,
		},
	);
	transporter.sendMail(
		{
			from: `<${config.mailer.user}>`,
			to: recipientMail,
			subject,
			html,
		},
		(err, info) => {
			if (err) {
				console.log(err);
			}
		},
	);
};
