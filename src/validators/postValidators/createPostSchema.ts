import * as yup from 'yup';

import { ETypePost } from '../../enums/postEnums';

export default yup.object({
	text: yup.string().required(),
	photos: yup.array().of(
		yup.object({
			photo: yup.string().url().required(),
			place: yup.number().min(1).max(10).required(),
		}),
	),
	typePost: yup.mixed<ETypePost>().oneOf(Object.values(ETypePost)).required(),
});
