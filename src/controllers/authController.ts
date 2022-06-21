import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import ApiError from '../errors/apiError';
import nodemailer from '../tools/nodemailer';

import User from '../db/entities/User';

import generateVerifyToken from '../generators/token/generateVerifyToken';
import generateAccessToken from '../generators/token/generateAccessToken';
import generateVerifyCode from '../generators/user/generateVerifyCode';
import { IReqWithToken } from './interfaces';

export default {
	async registration(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { userName, email, password } = req.body;
			const userCandidate = await User.findOne({
				email,
				user_name: userName,
			});
			let includes = false;
			if (userCandidate?.verified === true) {
				throw ApiError.BadRequest(
					'User with email and userName already exist',
				);
			} else if (userCandidate.verified === false) {
				userCandidate.user_name = userName;
				userCandidate.email = email;
				userCandidate.verify_code = generateVerifyCode(6);
				includes = true;
				await userCandidate.save();
				await nodemailer(
					userCandidate.email,
					'Verify code',
					`Code: ${userCandidate.verify_code}`,
				);
				const verifyToken = generateVerifyToken({
					id: userCandidate.id,
				});
				res.json({ verifyToken });
			}
			if (!includes) {
				const emailCandidate = await User.findOne({ email });
				if (emailCandidate.verified === true) {
					throw ApiError.BadRequest('User with email already exist');
				} else if (emailCandidate.verified === false) {
					emailCandidate.email = email;
					emailCandidate.user_name = userName;
					emailCandidate.verify_code = generateVerifyCode(6);
					includes = true;
					await emailCandidate.save();
					await nodemailer(
						emailCandidate.email,
						'Verify code',
						`Code: ${emailCandidate.verify_code}`,
					);
					const verifyToken = generateVerifyToken({
						id: emailCandidate.id,
					});
					res.json({ verifyToken });
				}

				if (!includes) {
					const userNameCandidate = await User.findOne({
						user_name: userName,
					});
					if (userNameCandidate.verified === true) {
						throw ApiError.BadRequest(
							'User with email already exist',
						);
					} else if (userNameCandidate.verified === false) {
						userNameCandidate.email = email;
						userNameCandidate.user_name = userName;
						userNameCandidate.verify_code = generateVerifyCode(6);
						includes = true;
						await userNameCandidate.save();
						await nodemailer(
							userNameCandidate.email,
							'Verify code',
							`Code: ${userNameCandidate.verify_code}`,
						);
						const verifyToken = generateVerifyToken({
							id: userNameCandidate.id,
						});
						res.json({ verifyToken });
					}
				}
			} else {
				const hashPassowrd = await bcrypt.hash(password, 10);
				const user = User.create({
					user_name: userName,
					email,
					verify_code: generateVerifyCode(6),
					password: hashPassowrd,
				});
				await user.save();
				await nodemailer(
					user.email,
					'Verify code',
					`Code: ${user.verify_code}`,
				);
				const verifyToken = generateVerifyToken({ id: user.id });
				res.json({ verifyToken });
			}
		} catch (err) {
			next(err);
		}
	},

	async verifyUser(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const code = +req.query.code;
			const user = await User.findOne(
				{ id: profileId },
				{ select: ['id', 'email', 'verify_code'] },
			);
			if (+user.verify_code === code) {
				user.verified = true;
				await user.save();
				const accessToken = generateAccessToken({ id: user.id });
				res.json({ verified: true, success: true, accessToken });
			} else {
				user.verify_code = generateVerifyCode(6);
				await user.save();
				throw ApiError.BadRequest('Invalid code');
			}
		} catch (err) {
			next(err);
		}
	},

	async login(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email, password }: { email: string; password: string } =
				req.body;
			const user = await User.findOne({
				where: { email },
				select: ['id', 'verified', 'email', 'password'],
			});
			if (!user) {
				throw ApiError.BadRequest('Email or password are invalid');
			}
			if (user.verified === false) {
				throw ApiError.BadRequest('User is not verified');
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				throw ApiError.BadRequest('Email or password are invalid');
			}
			const accessToken = generateAccessToken({ id: user.id });
			res.json({ success: true, accessToken });
		} catch (err) {
			console.log(err);
			next(err);
		}
	},
};
