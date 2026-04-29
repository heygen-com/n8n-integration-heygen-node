import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions';
import { HEYGEN_TEMPLATE_LIST_AND_GENERATE_API_VERSION } from '../../shared/heygen_template_api_version';
import { buildCreateAvatarVideoV3Body, buildTranslateVideoV3Body } from '../../shared/heygen_v3_video_body';

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

export async function createVideoAgentApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const prompt = this.getNodeParameter('prompt', i) as string;
	
	if (!prompt || prompt.length === 0) {
		throw new NodeOperationError(this.getNode(), 'Prompt is required and must be between 1-10000 characters.');
	}
	
	if (prompt.length > 10000) {
		throw new NodeOperationError(this.getNode(), 'Prompt must be between 1-10000 characters.');
	}

	const body: IDataObject = { prompt };

	const configParam = this.getNodeParameter('config.configValues', i, {}) as IDataObject | undefined;
	if (configParam && Object.keys(configParam).length > 0) {
		const config = configParam as IDataObject;

		if (config.duration_sec) {
			const duration = config.duration_sec as number;
			if (duration < 5) {
				throw new NodeOperationError(this.getNode(), 'Duration must be at least 5 seconds.');
			}
			body.duration_sec = duration;
		}

		if (config.orientation) {
			body.orientation = config.orientation as string;
		}

		if (config.avatar_id) {
			body.avatar_id = config.avatar_id as string;
		}
	}

	return await heyGenApiRequest.call(this, 'POST', '/video-agents', body, {}, {}, 'api', 'v3');
}

export async function translateVideoApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const body = buildTranslateVideoV3Body.call(this, i);
	return await heyGenApiRequest.call(this, 'POST', '/video-translations', body, {}, {}, 'api', 'v3');
}