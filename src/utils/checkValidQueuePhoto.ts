/* eslint-disable no-plusplus */
import ApiError from '../errors/apiError';

import { IRequestQueuePhoto } from '../interfaces/photoInterface';

export default (photos: IRequestQueuePhoto[]): void => {
	if (photos.length > 10) {
		throw ApiError.BadRequest(
			'The maximum number of photos at a time should be no more than 10!',
		);
	}
	for (let i = 0; i < photos.length; i++) {
		let counter = 0;
		for (let j = 0; j < photos.length; j++) {
			if (photos[i].place === photos[j].place) {
				counter += 1;
			}
		}
		if (counter >= 2) {
			throw ApiError.BadRequest(
				'The place in the queue of each photo must be unique!',
			);
		}
	}
};
