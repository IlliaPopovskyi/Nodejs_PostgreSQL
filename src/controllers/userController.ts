/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import { NextFunction, Response } from 'express';
import { Like, Not } from 'typeorm';

import ApiError from '../errors/apiError';
import { IReqWithToken } from './interfaces';

import User from '../db/entities/User';
import Photo from '../db/entities/Photo';
import { ETypePhoto } from '../enums/photoEnums';

export default {
	async findUsers(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const page = +req.query.page;
			const size = +req.query.size;
			const skip = (page - 1) * size;
			const take = size;
			const users = await User.find({
				where: [
					{
						id: Not(profileId),
						verified: true,
						first_name: Like(`%${req.query.search || ''}%`),
					},
					{
						id: Not(profileId),
						verified: true,
						middle_name: Like(`%${req.query.search || ''}%`),
					},
					{
						id: Not(profileId),
						verified: true,
						last_name: Like(`%${req.query.search || ''}%`),
					},
					{
						id: Not(profileId),
						verified: true,
						user_name: Like(`%${req.query.search || ''}%`),
					},
				],
				order: {
					created_at: 'DESC',
				},
				select: [
					'id',
					'first_name',
					'middle_name',
					'last_name',
					'email',
					'verified',
					'created_at',
				],
				take,
				skip,
			});

			res.json({ users, page, size });
		} catch (err) {
			next(err);
		}
	},

	async getProfile(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const id = req.query.id as unknown as number;
			const profile = id
				? await User.findOne({ id }, { relations: ['main_photo'] })
				: await User.findOne(
						{ id: profileId },
						{
							relations: ['main_photo', 'my_groups', 'photos'],
						},
				  );
			if (!profile) {
				throw ApiError.NotFound('User by id not found');
			} else if (profile.id === profileId) {
				res.json({ profile, success: true, ownProfile: true });
			} else {
				res.json({ profile, success: true, ownProfile: false });
			}
		} catch (err) {
			next(err);
		}
	},

	async updateProfile(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const { firstName, middleName, lastName, email } = req.body;
			const user = await User.findOne(
				{ id: profileId },
				{
					select: [
						'id',
						'user_name',
						'first_name',
						'middle_name',
						'last_name',
						'email',
						'created_at',
						'updated_at',
					],
				},
			);
			if (email) {
				const userCandidate = await User.findOne({
					email,
					id: Not(profileId),
				});
				if (!userCandidate) {
					user.email = email;
				} else {
					throw ApiError.BadRequest(
						'User with this email already exist',
					);
				}
			}
			user.first_name = firstName || user.first_name;
			user.middle_name = middleName || user.middle_name;
			user.last_name = lastName || user.last_name;
			await user.save();
			res.json({ user, success: true });
		} catch (err) {
			next(err);
		}
	},

	async getPhotos(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const id = Number(req.query.id);
			const user = await User.findOne(
				{
					id: id || profileId,
				},
				{ relations: ['photos', 'main_photo'] },
			);
			if (!user) {
				throw ApiError.NotFound('User by id not found!');
			}
			const photos = user.photos;
			if (user.main_photo !== null) {
				photos.sort((a, b) => {
					if (a.id === user.main_photo.id) {
						return -1;
					}
					if (b.id === user.main_photo.id) {
						return 1;
					}
					return b.updated_at.getTime() - a.updated_at.getTime();
				});
			} else {
				photos.sort((a, b) => {
					return b.updated_at.getTime() - a.updated_at.getTime();
				});
			}
			res.json({ success: true, photos });
		} catch (err) {
			next(err);
		}
	},

	async updatePhoto(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const { photo } = req.body;

			const user = await User.findOne(profileId, {
				relations: ['photos', 'main_photo'],
			});
			const newPhoto = Photo.create({
				url: photo,
				photo_type: ETypePhoto.user,
			});
			user.main_photo.updated_at = new Date();
			await user.save();
			user.main_photo = newPhoto;
			user.photos.push(newPhoto);
			await user.save();
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},

	async removePhoto(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const id = Number(req.query.id);

			const photo = await Photo.findOne({
				where: { id },
				relations: ['user'],
			});
			if (!photo) {
				throw ApiError.BadRequest('Photo by id not found');
			}
			if (photo.user?.id !== profileId) {
				throw ApiError.Forbidden('This is not your a photo');
			}
			const user = await User.findOne(profileId, {
				relations: ['main_photo', 'photos'],
			});
			if (user.photos?.length !== 0 || user.photos !== null) {
				const arrPhotos = user.photos;
				if (arrPhotos.length === 1) {
					user.main_photo = null;
					await user.save();
				} else {
					arrPhotos.sort((a, b) => {
						return (
							new Date(b.updated_at).getTime() -
							new Date(a.updated_at).getTime()
						);
					});
					console.log(arrPhotos[0]);
					user.main_photo = arrPhotos[0];
					await user.save();
				}
			}
			await photo.remove();

			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},

	async editMainPhoto(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const id = Number(req.query.id);
			const user = await User.findOne({
				where: { id: profileId },
				relations: ['main_photo', 'photos'],
			});
			if (user.main_photo !== null) {
				const newMainPhoto = await Photo.findOne(id);
				if (newMainPhoto.user.id !== profileId) {
					throw ApiError.Forbidden('This is not your photo!');
				}
				user.main_photo.updated_at = new Date();
				await user.save();
				user.main_photo = newMainPhoto;
				await user.save();
				res.json({ success: true });
			} else {
				const newMainPhoto = await Photo.findOne(id, {
					relations: ['user'],
				});
				if (newMainPhoto.user.id !== profileId) {
					throw ApiError.Forbidden('This is not your photo!');
				}
				user.main_photo = newMainPhoto;
				await user.save();
				res.json({ success: true });
			}
		} catch (err) {
			next(err);
		}
	},

	async removeAccount(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const user = await User.findOne({ id: profileId });
			await User.remove(user);
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},
};
