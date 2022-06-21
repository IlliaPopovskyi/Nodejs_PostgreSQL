import * as express from 'express';
import userController from '../controllers/userController';
import validationMiddleware from '../middlewares/validation';
import authMiddleware from '../middlewares/auth';

import paginationSchema from '../validators/baseValidators/paginationSchema';
import idSchema from '../validators/baseValidators/idSchema';
import updateProfileSchema from '../validators/userValidators/updateProfileSchema';
import photoSchema from '../validators/baseValidators/photoSchema';

const userRouter = express.Router();

userRouter.get(
	'/users',
	authMiddleware.userAuthToken,
	validationMiddleware(paginationSchema, 'query'),
	userController.findUsers,
);

userRouter.get(
	'/profile',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.optional, 'query'),
	userController.getProfile,
);

userRouter.put(
	'/profile',
	authMiddleware.userAuthToken,
	validationMiddleware(updateProfileSchema, 'body'),
	userController.updateProfile,
);

userRouter.get(
	'/photos',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.optional, 'query'),
	userController.getPhotos,
);

userRouter.put(
	'/photo',
	authMiddleware.userAuthToken,
	validationMiddleware(photoSchema.required, 'body'),
	userController.updatePhoto,
);

userRouter.delete(
	'/photo',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	userController.removePhoto,
);

userRouter.put(
	'/editMainPhoto',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	userController.editMainPhoto,
);

userRouter.delete(
	'/remove',
	authMiddleware.userAuthToken,
	userController.removeAccount,
);

export default userRouter;
