import User from '../db/entities/User';
import ApiError from '../errors/apiError';

export default async (email: string): Promise<void> => {
	const user = await User.findOne({ email, verified: true });
	if (user) {
		throw ApiError.BadRequest(
			`User with email like <${email}>, already exist!`,
		);
	}
};
