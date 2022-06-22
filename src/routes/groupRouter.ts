import * as express from 'express';

import basicEditGroupSchema from '../validators/baseValidators/basicEditGroupSchema';
import createGroupSchema from '../validators/groupValidators/createGroupSchema';
import createPostSchema from '../validators/postValidators/createPostSchema';
import paginationSchema from '../validators/baseValidators/paginationSchema';
import idGroupSchema from '../validators/groupValidators/idGroupSchema';
import photoSchema from '../validators/baseValidators/photoSchema';
import idSchema from '../validators/baseValidators/idSchema';

import validation from '../middlewares/validation';
import auth from '../middlewares/auth';

import groupController from '../controllers/groupController';

const groupRouter = express.Router();

groupRouter.post(
	'/create',
	auth.userAuthToken,
	validation(createGroupSchema, 'body'),
	groupController.create,
);

groupRouter.get(
	'/search',
	auth.userAuthToken,
	validation(paginationSchema, 'query'),
	groupController.search,
);

groupRouter.delete(
	'/remove',
	auth.userAuthToken,
	validation(idGroupSchema, 'query'),
	groupController.removeGroup,
);

groupRouter.put(
	'/basicUpdate',
	auth.userAuthToken,
	validation(idGroupSchema, 'query'),
	validation(basicEditGroupSchema, 'body'),
	groupController.baseEditGroup,
);

groupRouter.post(
	'/photo',
	auth.userAuthToken,
	validation(idGroupSchema, 'query'),
	validation(photoSchema.required, 'body'),
	groupController.setPhoto,
);

groupRouter.post(
	'/post',
	auth.userAuthToken,
	validation(idGroupSchema, 'query'),
	validation(createPostSchema, 'body'),
	groupController.createPost,
);

groupRouter.delete(
	'/post',
	auth.userAuthToken,
	validation(idGroupSchema, 'query'),
	validation(idSchema.required, 'query'),
	groupController.removePost,
);

export default groupRouter;
