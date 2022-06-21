import * as jwt from 'jsonwebtoken';
import config from '../../config';

export default (payload: any): string => {
	const { verifySecret } = config.jwt;
	return jwt.sign(payload, verifySecret);
};
