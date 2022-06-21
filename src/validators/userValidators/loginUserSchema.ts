import * as yup from 'yup';

export default yup.object({
	email: yup.string().required(),
	password: yup.string().required(),
});
