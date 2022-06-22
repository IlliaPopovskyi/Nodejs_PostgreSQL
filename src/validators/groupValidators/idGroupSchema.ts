import * as yup from 'yup';

export default yup.object({
	group: yup.string().required(),
});
