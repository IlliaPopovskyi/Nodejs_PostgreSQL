import * as yup from 'yup';

export default yup.object({
	text: yup.string().required(),
	photos: yup.array().of(yup.string().url()),
});
