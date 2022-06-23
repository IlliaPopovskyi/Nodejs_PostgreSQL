import User from '../db/entities/User';
import ApiError from '../errors/apiError';

export default async (userName: string): Promise<void> => {
	const user = await User.findOne({ user_name: userName, verified: true });
	if (user) {
		throw ApiError.BadRequest(
			`User with username like <${userName}>, already exist!`,
		);
	}
};
