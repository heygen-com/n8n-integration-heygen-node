import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions';
import { HEYGEN_TEMPLATE_LIST_AND_GENERATE_API_VERSION } from '../../shared/heygen_template_api_version';
import { buildCreateAvatarVideoV3Body, buildTranslateVideoV3Body } from '../../shared/heygen_v3_video_body';
import { buildPostV3VideosBody } from '../../shared/build_post_v3_video_body';

export async function createAvatarVideoApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const body = buildCreateAvatarVideoV3Body.call(this, i);
	return await heyGenApiRequest.call(this, 'POST', '/videos', body, {}, {}, 'api', 'v3');
}

export async function createTemplateVideoApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const body: IDataObject = {
		caption: this.getNodeParameter('caption', i) as boolean,
	};

	body.test = this.getNodeParameter('additionalFields.test', i, false) as boolean;

	const optionalFields = ['title', 'callbackId', 'callbackUrl', 'folderId'];
	for (const field of optionalFields) {
		const value = this.getNodeParameter(`additionalFields.${field}`, i, '') as string;
		if (value) body[field.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
	}

	body.enable_sharing = this.getNodeParameter('enableSharing', i, false) as boolean;

	// Dimensions
	const dimension = this.getNodeParameter('dimension', i) as IDataObject;
	body.dimension = dimension?.dimensionValues ?? { width: 1280, height: 720 };

	// Template ID
	const template_id = this.getNodeParameter('templateIDString', i, '') as string || this.getNodeParameter('templateIDOptions', i) as string;
	if (!template_id) {
		throw new NodeOperationError(this.getNode(), 'You must provide a Template ID manually or select one from the list.');
	}

	// Template Variables
	const templateVariables = this.getNodeParameter('templateVariables.variable', i, []) as IDataObject[];
	const variables: Record<string, IDataObject> = {};

	for (const v of templateVariables) {
		const key = v.key as string;
		const type = v.type as string;

		if (!key || !type) continue;

		const variable: IDataObject = {
			name: key, //v.name || key, - we show user only key field, and fill variable name just in request
			type,
			properties: {},
		};

		if (type === 'text') {
			variable.properties = { content: v.textContent || '' };
		} else if (type === 'voice') {
			variable.properties = { voice_id: v.voiceId || '' };
		}

		variables[key] = variable;
	}

	body.variables = variables;

	return await heyGenApiRequest.call(
		this,
		'POST',
		`/template/${template_id}/generate`,
		body,
		{},
		{},
		'api',
		HEYGEN_TEMPLATE_LIST_AND_GENERATE_API_VERSION,
	);
}

export async function getVideoStatusApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	// Get video status
	const videoId = this.getNodeParameter('videoId', i) as string;

	return await heyGenApiRequest.call(this, 'GET', `/videos/${encodeURIComponent(videoId)}`, {}, {}, {}, 'api', 'v3');
}

export async function translateVideoApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const body = buildTranslateVideoV3Body.call(this, i);
	return await heyGenApiRequest.call(this, 'POST', '/video-translations', body, {}, {}, 'api', 'v3');
}

export async function listVideosApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const qs: IDataObject = {};
	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;
	const folderId = this.getNodeParameter('videosFolderId', i, '') as string;
	if (folderId.trim()) qs.folder_id = folderId.trim();
	const title = this.getNodeParameter('videosTitleFilter', i, '') as string;
	if (title) qs.title = title;

	return (await heyGenApiRequest.call(this, 'GET', '/videos', {}, qs, {}, 'api', 'v3')) as IDataObject;
}

export async function deleteVideoApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const videoId = this.getNodeParameter('videoId', i, '') as string;
	if (!videoId?.trim()) {
		throw new NodeOperationError(this.getNode(), 'Video ID is required.');
	}
	return (await heyGenApiRequest.call(
		this,
		'DELETE',
		`/videos/${encodeURIComponent(videoId.trim())}`,
		{},
		{},
		{},
		'api',
		'v3',
	)) as IDataObject;
}

export async function createVideoV3Api(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const body = buildPostV3VideosBody.call(this, i);
	return (await heyGenApiRequest.call(this, 'POST', '/videos', body, {}, {}, 'api', 'v3')) as IDataObject;
}