import type { IExecuteFunctions } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions';
import { buildCreateAvatarV3Body } from '../../shared/build_create_avatar_body';

export async function createAvatarApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const body = buildCreateAvatarV3Body.call(this, i);
	return (await heyGenApiRequest.call(this, 'POST', '/avatars', body, {}, {}, 'api', 'v3')) as IDataObject;
}
