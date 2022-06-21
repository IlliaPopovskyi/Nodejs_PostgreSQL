import * as yup from 'yup';

export default yup.object({
	firstName: yup.string(),
	middleName: yup.string(),
	lastName: yup.string(),
	email: yup.string().email(),
});
