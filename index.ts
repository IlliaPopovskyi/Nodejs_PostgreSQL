import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { Application } from 'express';

import apiRouter from './src/routes';
import connect from './src/db';

import config from './src/config';
import errorHandler from './src/errors/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(config.server.port, () => {
	console.log(
		`Server launched on port ${
			config.server.port
		} at ${new Date()}, in mode: ${config.server.mode}`,
	);
});
connect();

app.use('/api', apiRouter);

app.use(errorHandler);
