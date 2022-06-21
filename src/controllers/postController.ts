/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { NextFunction, Response } from 'express';
import { In, Like, Not } from 'typeorm';

import ApiError from '../errors/apiError';
import { IReqWithToken } from './interfaces';

import User from '../db/entities/User';
import Post from '../db/entities/Post';
import Photo from '../db/entities/Photo';

export default {
	async createPost(
		req: IReqWithToken,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { profileId } = req;
			const { text } = req.body;
			const { photos } = req.body;
			const user = await User.findOne({ id: profileId });
			const post = Post.create({ text, creator: user });
			await post.save();
			if (photos[0]) {
				const postPhotos = [];
				for (let i = 0; i < photos.length; i++) {
					const photo = Photo.create({
						url: photos[i],
						post,
					});
					await photo.save();
					postPhotos.push(photo);
				}
				post.photos = postPhotos;
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
				where: { id, user: { id: profileId } },
				relations: ['user'],
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

	async getMyPosts(
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
				relations: ['user', 'likes'],
				where: { user: { id: profileId } },
				take,
				skip,
				order: { created_at: -1 },
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
				relations: ['user', 'likes'],
				where: {
					user: { id: Not(profileId) },
					text: Like(`%${req.query.search || ''}%`),
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