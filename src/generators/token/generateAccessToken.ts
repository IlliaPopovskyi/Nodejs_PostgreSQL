import * as jwt from 'jsonwebtoken';
import config from '../../config';

export default (payload: any): string => {
	const { accessSecret } = config.jwt;
	// return {
	// 	accessToken: jwt.sign(payload, accessSecret),
	// 	refreshToken: jwt.sign(payload, refreshSecret),
	// };

	return jwt.sign(payload, accessSecret);
};
