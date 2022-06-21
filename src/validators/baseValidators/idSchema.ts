import * as yup from 'yup';

export default {
	required: yup.object({
		id: yup.number().required(),
	}),
	optional: yup.object({
		id: yup.number(),
	}),
};
