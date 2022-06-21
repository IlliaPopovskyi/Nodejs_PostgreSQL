import { NextFunction, Request, Response } from 'express';
import config from '../config';
import constants from '../constants';

import { EMode } from '../config/enums';
import logs from './logs';

export default (err, req: Request, res: Response, next: NextFunction) => {
	if (config.server.mode === EMode[EMode.PROD]) {
		if (err.status === constants.statusCode.SERVER_ERROR) {
			logs(err);
		}
	} else logs(err);

	res.status(err.status || constants.statusCode.SERVER_ERROR).json({
		success: false,
		message: err.message || 'Server error :_(',
	});
};
