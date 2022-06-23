import * as express from 'express';

import createPostSchema from '../validators/postValidators/createPostSchema';

import validationMiddleware from '../middlewares/validation';
import authMiddleware from '../middlewares/auth';

import postController from '../controllers/postController';
import idSchema from '../validators/baseValidators/idSchema';
import paginationSchema from '../validators/baseValidators/paginationSchema';

const postRouter = express.Router();

postRouter.post(
	'',
	authMiddleware.userAuthToken,
	validationMiddleware(createPostSchema, 'body'),
	postController.createPost,
); // worked

postRouter.delete(
	'',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	postController.deletePost,
); // worked

postRouter.patch(
	'/like',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	postController.likePost,
); // worked

postRouter.get(
	'/find',
	authMiddleware.userAuthToken,
	validationMiddleware(paginationSchema, 'query'),
	postController.findPosts,
); // worked

postRouter.get(
	'/user',
	authMiddleware.userAuthToken,
	validationMiddleware(paginationSchema, 'query'),
	validationMiddleware(idSchema.optional, 'query'),
	postController.getPostsByProfile,
);

postRouter.get(
	'/liked',
	authMiddleware.userAuthToken,
	validationMiddleware(paginationSchema, 'query'),
	validationMiddleware(idSchema.required, 'query'),
	postController.getLikedPosts,
);

export default postRouter;
