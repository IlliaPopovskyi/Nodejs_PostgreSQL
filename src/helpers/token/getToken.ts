export default function getToken(req): string {
	const { authorization } = req.headers;
	const [, token] = authorization && authorization.split(' ');
	return token;
}
