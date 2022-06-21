import * as express from 'express';

import createUserSchema from '../validators/userValidators/createUserSchema';
import verifyCodeShema from '../validators/userValidators/verifyCodeShema';
import loginUserSchema from '../validators/userValidators/loginUserSchema';

import validationMiddleware from '../middlewares/validation';
import authMiddleware from '../middlewares/auth';

import authController from '../controllers/authController';

const authRouter = express.Router();

authRouter.post(
	'/registration',
	validationMiddleware(createUserSchema, 'body'),
	authController.registration,
);

authRouter.post(
	'/verify',
	authMiddleware.verifyAuthToken,
	validationMiddleware(verifyCodeShema, 'query'),
	authController.verifyUser,
);

authRouter.post(
	'/login',
	validationMiddleware(loginUserSchema, 'body'),
	authController.login,
);

export default authRouter;
