import type { IExecuteFunctions } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions';
import { buildCreateVideoAgentSessionBody } from '../../shared/build_video_agent_session_body';

export async function listVideoAgentSessionsApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const qs: IDataObject = {};
	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;

	return (await heyGenApiRequest.call(this, 'GET', '/video-agents', {}, qs, {}, 'api', 'v3')) as IDataObject;
}

export async function createVideoAgentSessionApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const body = buildCreateVideoAgentSessionBody.call(this, i);
	return (await heyGenApiRequest.call(this, 'POST', '/video-agents', body, {}, {}, 'api', 'v3')) as IDataObject;
}

export async function listVideoAgentStylesApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const qs: IDataObject = {};
	const tag = this.getNodeParameter('videoAgentStylesTag', i, '') as string;
	if (tag.trim()) qs.tag = tag.trim();
	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;

	return (await heyGenApiRequest.call(
		this,
		'GET',
		'/video-agents/styles',
		{},
		qs,
		{},
		'api',
		'v3',
	)) as IDataObject;
}
