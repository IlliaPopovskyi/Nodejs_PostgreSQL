export default (length: number): number => {
	return Math.floor(1000 + Math.random() * 9 * (10 * length));
};
