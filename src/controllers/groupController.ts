/* eslint-disable no-plusplus */
import { NextFunction, Response } from 'express';
import { ILike } from 'typeorm';

import ApiError from '../errors/apiError';

import User from '../db/entities/User';
import Group from '../db/entities/Group';
import Photo from '../db/entities/Photo';
import Post from '../db/entities/Post';

import { IReqWithToken } from './interfaces';
import { ETypeBlog } from '../enums/groupEnums';
import { ETypePost } from '../enums/postEnums';

export default {
	async create(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const { name, title } = req.body;
			const admin = await User.findOne({ id: profileId });
			const group = Group.create({
				admin,
				name,
				title: title || null,
			});
			await group.save();
			res.json({ success: true, group });
		} catch (err) {
			next(err);
		}
	},

	async search(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const search = req.query.search?.toString();
			const page = +req.query.page;
			const size = +req.query.size;
			const skip = (page - 1) * size;
			const take = size;
			const groups = await Group.find({
				where: {
					name: ILike(`%${search}%`),
				},
				skip,
				take,
				relations: ['main_photo', 'admin', 'moderators'],
			});
			res.json({ page, size, groups });
		} catch (err) {
			next(err);
		}
	},

	async baseEditGroup(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const { name, title } = req.body;
			const group = await Group.findOne({
				where: {
					id: req.query.group,
				},
				relations: ['members', 'admin', 'main_photo', 'photos'],
			});
			if (!group) {
				throw ApiError.BadRequest('Group not found');
			}
			if (group.admin.id !== profileId) {
				throw ApiError.Forbidden('You are not admin');
			}
			group.name = name;
			group.title = title;
			await group.save();
			res.json({ group });
		} catch (err) {
			next(err);
		}
	},

	async removeGroup(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const group = await Group.findOne({
				where: {
					id: req.query.group,
				},
				relations: ['members', 'admin', 'mainPhoto', 'photos'],
			});
			if (!group) {
				throw ApiError.BadRequest(
					'Group by id not found or you are not admin this group',
				);
			}
			if (group.admin.id !== profileId) {
				throw ApiError.Forbidden('You are not admin');
			}
			await group.remove();
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},

	async setPhoto(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const group = await Group.findOne({
				where: {
					id: req.query.group,
				},
				relations: ['members', 'admin', 'mainPhoto', 'photos'],
			});
			if (!group) {
				throw ApiError.BadRequest(
					'Group by id not found or you are not admin this group',
				);
			}
			if (group.admin.id !== profileId) {
				throw ApiError.Forbidden('You are not admin');
			}
			const photo = Photo.create({ url: req.body.photo, group });
			group.main_photo = photo;
			group.photos.push(photo);
			await group.save();
			const resGroup = await Group.findOne({
				where: {
					id: req.query.id,
				},
				relations: ['members', 'admin', 'mainPhoto', 'photos'],
			});
			res.json({ success: true, group: resGroup });
		} catch (err) {
			next(err);
		}
	},

	async setModerator(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const group = await Group.findOne(req.query.group.toString(), {
				relations: ['admin', 'moderators'],
			});
			if (!group) {
				throw ApiError.BadRequest('Group by id not found');
			}
			if (group.admin.id !== profileId) {
				throw ApiError.Forbidden('You are not admin this group!');
			}
			const user = await User.findOne(req.query.user.toString());
			if (!user) {
				throw ApiError.BadRequest('User by id not found');
			}
			let includes = false;
			for (let i = 0; i < group.moderators.length; i++) {
				if (group.moderators[i].id === user.id) {
					includes = true;
				}
			}
			if (includes === false) {
				group.moderators.push(user);
				await group.save();
			} else {
				throw ApiError.BadRequest('This moderator already has rules!');
			}
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},

	async removeModerator(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const group = await Group.findOne(req.query.group.toString(), {
				relations: ['admin', 'moderators'],
			});
			if (!group) {
				throw ApiError.BadRequest('Group by id not found');
			}
			if (group.admin.id !== profileId) {
				throw ApiError.Forbidden('You are not admin this group!');
			}
			const user = await User.findOne(req.query.user.toString());
			if (!user) {
				throw ApiError.BadRequest('User by id not found');
			}
			let includes = false;
			for (let i = 0; i < group.moderators.length; i++) {
				if (group.moderators[i].id === +req.query.user) {
					includes = true;
					break;
				}
			}

			if (includes === false) {
				throw ApiError.BadRequest('Moderator by id not found');
			} else {
				group.moderators = group.moderators.filter(
					user => user.id !== +req.query.user,
				);
				await group.save();
			}
			res.json({ moderators: group.moderators });
		} catch (err) {
			next(err);
		}
	},

	async createPost(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const group = await Group.findOne(+req.query.group, {
				relations: ['admin', 'moderators'],
			});
			if (!group) {
				throw ApiError.BadRequest('Group by id not found');
			}
			const user = await User.findOne(profileId);
			if (group.blogType === ETypeBlog.author) {
				if (group.admin.id !== profileId) {
					throw ApiError.Forbidden('You are not admin!');
				}
			} else if (group.blogType === ETypeBlog.administration) {
				if (group.admin.id !== profileId) {
					let includes = false;
					for (let i = 0; i < group.moderators.length; i++) {
						if (group.moderators[i].id === +req.query.user) {
							includes = true;
							break;
						}
					}
					if (includes === false) {
						throw ApiError.Forbidden(
							'You are not includes in administration this group!',
						);
					}
					const post = Post.create({
						text: req.body.text,
						title: req.body.title,
						creator: user,
						type_post: ETypePost.group,
					});
					group.posts.push(post);
					await group.save();
				}
			} else {
				const post = Post.create({
					text: req.body.text,
					title: req.body.title,
					creator: user,
					type_post: ETypePost.group,
				});
				group.posts.push(post);
				await group.save();
			}

			await group.save();
		} catch (err) {
			next(err);
		}
	},

	async removePost(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const group = await Group.findOne(+req.query.group, {
				relations: ['posts', 'admin', 'moderators'],
			});
			if (group.admin.id !== profileId) {
				let includes = false;
				for (let i = 0; i < group.moderators.length; i++) {
					if (group.moderators[i].id === +req.query.user) {
						includes = true;
						break;
					}
				}
				if (includes === false) {
					throw ApiError.Forbidden(
						'You are not includes in administration this group!',
					);
				}
			}
			group.posts = group.posts.filter(
				post => post.id !== +req.query.post,
			);
			await group.save();
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},
};
