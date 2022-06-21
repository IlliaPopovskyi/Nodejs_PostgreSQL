import * as jwt from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/apiError';
import { ETokenType } from '../../enums/tokenEnums';

export default (token: string, type: keyof typeof ETokenType): any => {
	let key: string;
	switch (type) {
		case ETokenType[ETokenType.access]: {
			key = config.jwt.accessSecret;
			break;
		}
		case ETokenType[ETokenType.refresh]: {
			key = config.jwt.refreshSecret;
			break;
		}
		case ETokenType[ETokenType.verify]: {
			key = config.jwt.verifySecret;
			break;
		}
		default: {
			throw ApiError.ServerError('Invalid token type');
		}
	}
	return jwt.verify(token, key);
};
