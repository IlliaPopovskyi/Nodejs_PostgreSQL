import * as yup from 'yup';

export default yup.object({
	user: yup.string().required(),
});
