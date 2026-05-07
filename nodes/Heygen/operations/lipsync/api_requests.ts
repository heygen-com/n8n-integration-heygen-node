import type { IExecuteFunctions } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions';
import { buildCreateLipsyncBody } from '../../shared/build_create_lipsync_body';

export async function listLipsyncsApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const qs: IDataObject = {};
	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;

	return (await heyGenApiRequest.call(this, 'GET', '/lipsyncs', {}, qs, {}, 'api', 'v3')) as IDataObject;
}

export async function createLipsyncApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const body = buildCreateLipsyncBody.call(this, i);
	return (await heyGenApiRequest.call(this, 'POST', '/lipsyncs', body, {}, {}, 'api', 'v3')) as IDataObject;
}

export async function getLipsyncApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const id = encodeURIComponent(this.getNodeParameter('lsLipsyncId', i) as string);
	return (await heyGenApiRequest.call(
		this,
		'GET',
		`/lipsyncs/${id}`,
		{},
		{},
		{},
		'api',
		'v3',
	)) as IDataObject;
}

export async function deleteLipsyncApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const id = encodeURIComponent(this.getNodeParameter('lsLipsyncId', i) as string);
	return (await heyGenApiRequest.call(
		this,
		'DELETE',
		`/lipsyncs/${id}`,
		{},
		{},
		{},
		'api',
		'v3',
	)) as IDataObject;
}

export async function updateLipsyncApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const id = encodeURIComponent(this.getNodeParameter('lsLipsyncId', i) as string);
	const title = this.getNodeParameter('lsTitle', i) as string;
	const body: IDataObject = { title };

	return (await heyGenApiRequest.call(
		this,
		'PATCH',
		`/lipsyncs/${id}`,
		body,
		{},
		{},
		'api',
		'v3',
	)) as IDataObject;
}
