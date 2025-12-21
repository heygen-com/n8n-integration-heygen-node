import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions'; 

export async function createAvatarVideoApi(
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

	// Dimensions
	const dimension = this.getNodeParameter('dimension', i) as IDataObject;
	body.dimension = dimension?.dimensionValues ?? { width: 1280, height: 720 };

	// Video Inputs
	const videoInputs = this.getNodeParameter('videoInput.videoInputValues', i, []) as IDataObject[];
	if (!videoInputs.length) {
		throw new NodeOperationError(this.getNode(), 'At least one video input scene is required');
	}

	body.video_inputs = videoInputs.map(input => {
		const scene: IDataObject = {};

		if (input.characterType === 'avatar') {
			scene.character = {
				type: 'avatar',
				avatar_id: input.avatarId,
				scale: input.scale || 1.0,
				avatar_style: input.avatarStyle || 'normal',
				offset: { x: input.offsetX || 0.0, y: input.offsetY || 0.0 },
			};
		} else if (input.characterType === 'talking_photo') {
			scene.character = {
				type: 'talking_photo',
				talking_photo_id: input.talkingPhotoId,
				scale: input.scale || 1.0,
				talking_photo_style: input.talkingPhotoStyle || '',
				offset: { x: input.offsetX || 0.0, y: input.offsetY || 0.0 },
				talking_style: input.talkingStyle || 'stable',
				expression: input.expression || 'default',
			};
		}

		if (input.voiceType === 'text') {
			scene.voice = {
				type: 'text',
				voice_id: input.voiceId,
				input_text: input.inputText,
				speed: input.speed || 1.0,
			};
		} else if (input.voiceType === 'audio') {
			scene.voice = {
				type: 'audio',
				audio_url: input.audioUrl,
			};
		} else if (input.voiceType === 'silence') {
			scene.voice = {
				type: 'silence',
				duration: input.duration || 1.0,
			};
		}

		if (input.backgroundType === 'color') {
			scene.background = {
				type: 'color',
				value: input.backgroundColor || '#f6f6fc',
			};
		} else if (input.backgroundType === 'image') {
			scene.background = {
				type: 'image',
				url: input.backgroundImageUrl,
				fit: input.backgroundFit || 'cover',
			};
		} else if (input.backgroundType === 'video') {
			scene.background = {
				type: 'video',
				url: input.backgroundVideoUrl,
				play_style: input.backgroundPlayStyle || 'fit_to_scene',
				fit: input.backgroundFit || 'cover',
			};
		}

		return scene;
	});

	return await heyGenApiRequest.call(this,'POST','/video/generate',body,{},{},'api','v2',
	);
}


export async function createTemplateVideoApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const body: IDataObject = {
		caption: this.getNodeParameter('caption', i) as boolean,
	};

	const optionalFields = ['title', 'callbackId', 'callbackUrl', 'folderId'];
	for (const field of optionalFields) {
		const value = this.getNodeParameter(field, i, '') as string;
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

	return await heyGenApiRequest.call(this,'POST',`/template/${template_id}/generate`,body,{},{},'api','v2',
	);
}

export async function getVideoStatusApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	// Get video status
	const videoId = this.getNodeParameter('videoId', i) as string;

	return await heyGenApiRequest.call(
		this,'GET','/video_status.get',{},{ video_id: videoId },{},'api','v1'
	);

}

