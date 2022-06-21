import * as express from 'express';

import userRouter from './userRouter';
import authRouter from './authRouter';
import postRouter from './postRouter';
import groupRouter from './groupRouter';

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/post', postRouter);
apiRouter.use('/group', groupRouter);

export default apiRouter;
