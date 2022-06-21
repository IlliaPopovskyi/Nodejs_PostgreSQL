export default error => {
	console.log(
		`Error happened in time: ${new Date().toDateString()} ========>\n`,
		error,
	);
	console.log('==============>\n');
};
