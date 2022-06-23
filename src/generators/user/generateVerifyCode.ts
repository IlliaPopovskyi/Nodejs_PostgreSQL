export default (length: number): number => {
	const a = 10 ** (length - 1);
	const b = 9 * 10 ** (length - 1);
	return Math.floor(a + Math.random() * b);
};
