import * as yup from 'yup';

export default yup.object({
	userName: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().required(),
});
