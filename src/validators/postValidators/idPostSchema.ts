import * as yup from 'yup';

export default yup.object({
	post: yup.string().required(),
});
