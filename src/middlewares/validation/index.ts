import { NextFunction, Response, Request } from 'express';
import * as yup from 'yup';
import ApiError from '../../errors/apiError';
import { ETypeValidation } from './enums';

export default (schema: yup.BaseSchema, type: keyof typeof ETypeValidation) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await schema.validate(req[type]);
			next();
		} catch (err) {
			next(
				ApiError.BadRequest(
					`Validation in ${type} error: ${err.message}`,
				),
			);
		}
	};
