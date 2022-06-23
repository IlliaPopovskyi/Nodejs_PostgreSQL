/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { NextFunction, Response } from 'express';
import { Not, ILike } from 'typeorm';

import ApiError from '../errors/apiError';
import { IReqWithToken } from './interfaces';
import { IRequestQueuePhoto } from '../interfaces/photoInterface';

import User from '../db/entities/User';
import Post from '../db/entities/Post';
import Photo from '../db/entities/Photo';
import { ETypePhoto } from '../enums/photoEnums';
import checkValidQueuePhoto from '../utils/checkValidQueuePhoto';

export default {
	async createPost(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const { text, title, typePost } = req.body;
			const photos = req.body.photos as IRequestQueuePhoto[];
			if (photos[0] && photos.length >= 2) {
				checkValidQueuePhoto(photos);
			}
			const user = await User.findOne({ id: profileId });
			const post = Post.create({
				text,
				title,
				creator: user,
				type_post: typePost,
			});
			await post.save();
			if (photos[0]) {
				for (let i = 0; i < photos.length; i++) {
					const photo = Photo.create({
						url: photos[i].photo,
						post,
						photo_type: ETypePhoto.post,
						queue_place: photos[i].place,
					});
					if (!post.photos) {
						post.photos = [photo];
					} else {
						post.photos.push(photo);
					}
				}
				await post.save();
			}

			res.json({ success: true, post });
		} catch (err) {
			next(err);
		}
	},

	async deletePost(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const id = req.query.id as unknown as string;
			const post = await Post.findOne({
				where: { id, creator: { id: profileId } },
			});
			if (!post) {
				throw ApiError.NotFound('Post by id not found');
			}

			await post.remove();
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},

	async likePost(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const id = req.query.id as unknown as string;
			const user = await User.findOne({ id: profileId });
			const post = await Post.findOne({
				relations: ['likes'],
				where: { id },
			});
			if (!post) {
				throw ApiError.NotFound('Post by id not found');
			}
			let message = 'Delete like success!';
			let like = true;

			post.likes = post.likes.filter(user => {
				if (user.id !== profileId) {
					return true;
				}
				like = false;
				return false;
			});
			await post.save();

			if (like === true) {
				like = true;
				message = 'Set like success';
				post.likes.push(user);
				await post.save();
			}
			res.json({ message, like, success: true, post });
		} catch (err) {
			next(err);
		}
	},

	async getPostsByProfile(
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
			const posts = await Post.find({
				relations: ['creator', 'likes', 'photos', 'creator.main_photo'],
				where: { creator: { id: +req.query.id || profileId } },
				take,
				skip,
				order: { created_at: 'DESC' },
			});
			res.json({ posts, page, size });
		} catch (err) {
			next(err);
		}
	},

	async findPosts(
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
			const posts = await Post.find({
				relations: ['creator', 'likes'],
				where: {
					creator: { id: Not(profileId) },
					text: ILike(`%${req.query.search || ''}%`),
				},
				skip,
				take,
			});
			res.json({ posts, page, size });
		} catch (err) {
			next(err);
		}
	},

	async getLikedPosts(
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
			const posts = await Post.find({
				where: { likes: profileId },
				relations: ['user', 'likes'],
				skip,
				take,
			});
			res.json({ posts });
		} catch (err) {
			next(err);
		}
	},
};
