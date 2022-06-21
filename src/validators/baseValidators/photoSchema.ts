import * as yup from 'yup';

export default {
	required: yup.object({
		photo: yup.string().url().required(),
	}),
	optional: yup.object({
		photo: yup.string().url().required(),
	}),
};
