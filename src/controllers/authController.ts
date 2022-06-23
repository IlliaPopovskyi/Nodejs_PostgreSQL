import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import ApiError from '../errors/apiError';
import nodemailer from '../tools/nodemailer';

import User from '../db/entities/User';

import generateVerifyToken from '../generators/token/generateVerifyToken';
import generateAccessToken from '../generators/token/generateAccessToken';
import generateVerifyCode from '../generators/user/generateVerifyCode';
import { IReqWithToken } from './interfaces';

import checkUserNameExist from '../utils/checkUserNameExist';
import checkEmailExist from '../utils/checkEmailExist';

export default {
	async registration(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { userName, email, password } = req.body;
			await checkUserNameExist(userName);
			await checkEmailExist(email);
			const users = await User.find({
				where: [
					{ user_name: userName, verified: false },
					{ email, verified: false },
				],
			});
			if (users.length >= 1) {
				const userIds = users.map(user => user.id);
				await User.delete(userIds);
			}
			const verifyCode = generateVerifyCode(6);
			const hashPassword = await bcrypt.hash(password, 10);
			const user = User.create({
				user_name: userName,
				email,
				password: hashPassword,
				verify_code: verifyCode,
			});
			await user.save();
			console.log(user.id);
			const verifyToken = generateVerifyToken({ id: user.id });
			await nodemailer(email, 'verify code', `<p>${verifyCode}<p>`);
			res.json({ verifyToken });
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
