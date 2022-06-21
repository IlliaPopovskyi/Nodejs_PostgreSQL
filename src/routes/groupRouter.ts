import * as express from 'express';

import basicEditGroupSchema from '../validators/baseValidators/basicEditGroupSchema';
import createGroupSchema from '../validators/groupValidators/createGroupSchema';
import paginationSchema from '../validators/baseValidators/paginationSchema';
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
	validation(idSchema.required, 'query'),
	groupController.removeGroup,
);

groupRouter.put(
	'/basicUpdate',
	auth.userAuthToken,
	validation(idSchema.required, 'query'),
	validation(basicEditGroupSchema, 'body'),
	groupController.baseEditGroup,
);

groupRouter.post(
	'/photo',
	auth.userAuthToken,
	validation(photoSchema.required, 'body'),
	groupController.setPhoto,
);
export default groupRouter;
