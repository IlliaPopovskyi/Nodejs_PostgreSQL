import { Request } from 'express';

export interface IReqWithToken extends Request {
	profileId: number;
}
