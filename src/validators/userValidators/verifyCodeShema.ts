import * as yup from 'yup';

export default yup.object({
	code: yup.number().required(),
});
