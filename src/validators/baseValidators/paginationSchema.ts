import * as yup from 'yup';

export default yup.object({
	page: yup.number().min(1).required(),
	size: yup.number().min(1).max(50).required(),
	search: yup.string(),
});
