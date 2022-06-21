import constants from '../constants';

export default class ApiError extends Error {
	status: number;

	errors: Error[];

	constructor(status: number, message: string, errors?: Error[] | []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}

	static UnauthorizedError(message?: string, errors?: Error[] | []) {
		return new ApiError(
			constants.statusCode.UNAUTHORIZED,
			message || 'UNAUTHORIZED',
			errors,
		);
	}

	static BadRequest(message?: string, errors?: Error[] | []) {
		return new ApiError(
			constants.statusCode.BAD_REQUEST,
			message || 'BAD_REQUEST',
			errors,
		);
	}

	static Forbidden(message?: string, errors?: Error[] | []) {
		return new ApiError(
			constants.statusCode.FORBIDDEN,
			message || 'FORBIDDEN',
			errors,
		);
	}

	static Conflict(message?: string, errors?: Error[] | []) {
		return new ApiError(
			constants.statusCode.CONFLICT,
			message || 'CONFLICT',
			errors,
		);
	}

	static NotFound(message?: string, errors?: Error[] | []) {
		return new ApiError(
			constants.statusCode.NOT_FOUND,
			message || 'NOT_FOUND',
			errors,
		);
	}

	static ServerError(message?: string, errors?: Error[] | []) {
		return new ApiError(
			constants.statusCode.SERVER_ERROR,
			message || 'SERVER_ERROR',
			errors,
		);
	}
}
