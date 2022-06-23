export default error => {
	console.log(
		`Error happened in time: ${new Date().toJSON()} ========>\n`,
		error,
	);
	console.log('==============>\n');
};
