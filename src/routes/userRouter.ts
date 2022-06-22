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
); // worked

userRouter.get(
	'/profile',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.optional, 'query'),
	userController.getProfile,
); // worked

userRouter.put(
	'/profile',
	authMiddleware.userAuthToken,
	validationMiddleware(updateProfileSchema, 'body'),
	userController.updateProfile,
); // worked

userRouter.get(
	'/photos',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.optional, 'query'),
	userController.getPhotos,
); // worked

userRouter.put(
	'/photo',
	authMiddleware.userAuthToken,
	validationMiddleware(photoSchema.required, 'body'),
	userController.updatePhoto,
); // worked

userRouter.delete(
	'/photo',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	userController.removePhoto,
); // worked

userRouter.put(
	'/editMainPhoto',
	authMiddleware.userAuthToken,
	validationMiddleware(idSchema.required, 'query'),
	userController.editMainPhoto,
); // worked

userRouter.delete(
	'/remove',
	authMiddleware.userAuthToken,
	userController.removeAccount,
); // worked

export default userRouter;
