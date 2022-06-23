import { NextFunction, Request, Response } from 'express';
import getToken from '../../helpers/token/getToken';
import ApiError from '../../errors/apiError';
import verifyToken from '../../helpers/token/verifyToken';

import { IReqWithToken } from '../../controllers/interfaces';

import User from '../../db/entities/User';

export default {
	async userAuthToken(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const authorizationHeader = req.headers.authorization;
			if (!authorizationHeader) {
				next(ApiError.UnauthorizedError('no auth headers'));
			} else {
				const token = getToken(req);
				if (!token) {
					next(ApiError.UnauthorizedError('no token'));
				}
				const verifiedData = verifyToken(token, 'access');
				if (!verifiedData) {
					next(ApiError.UnauthorizedError('invalid access token'));
				}
				const user = await User.findOne(
					{ id: verifiedData.id },
					{ select: ['id'] },
				);
				if (!user) {
					next(
						ApiError.UnauthorizedError(
							'User by id not found, maybe you was removed!',
						),
					);
				}
				req.profileId = verifiedData.id;
				next();
			}
		} catch (err) {
			next(err);
		}
	},

	async verifyAuthToken(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const authorizationHeader = req.headers.authorization;
			if (!authorizationHeader) {
				next(ApiError.UnauthorizedError('no auth headers'));
			} else {
				const token = getToken(req);
				if (!verifyToken) {
					next(ApiError.UnauthorizedError('no token'));
				}
				const verifiedData = verifyToken(token, 'verify');
				if (!verifiedData) {
					next(ApiError.UnauthorizedError('invalid access token'));
				}
				console.log(verifiedData);
				const user = await User.findOne(
					{ id: verifiedData.id },
					{ select: ['id'] },
				);
				if (!user) {
					next(
						ApiError.UnauthorizedError(
							'User by id not found, maybe you was removed!',
						),
					);
				}
				req.profileId = verifiedData.id;
				next();
			}
		} catch (err) {
			next(err);
		}
	},
};
