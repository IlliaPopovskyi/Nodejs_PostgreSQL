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
);

postRouter.delete(
	'',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	postController.deletePost,
);

postRouter.get(
	'/myPosts',
	authMiddleware.userAuthToken,
	validationMiddleware(paginationSchema, 'query'),
	postController.getMyPosts,
);

postRouter.patch(
	'/like',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	postController.likePost,
);

postRouter.get(
	'/find',
	authMiddleware.userAuthToken,
	validationMiddleware(paginationSchema, 'query'),
	postController.findPosts,
);

export default postRouter;
