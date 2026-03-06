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

	const body: IDataObject = {
		prompt,
	};

	const configParam = this.getNodeParameter('config.configValues', i, {}) as IDataObject | undefined;
	if (configParam && Object.keys(configParam).length > 0) {
		const configObj: IDataObject = {};
		const config = configParam as IDataObject;
		
		if (config.duration_sec) {
			const duration = config.duration_sec as number;
			if (duration < 5) {
				throw new NodeOperationError(this.getNode(), 'Duration must be at least 5 seconds.');
			}
			configObj.duration_sec = duration;
		}
		
		if (config.orientation) {
			configObj.orientation = config.orientation as string;
		}
		
		if (config.avatar_id) {
			configObj.avatar_id = config.avatar_id as string;
		}
		
		if (Object.keys(configObj).length > 0) {
			body.config = configObj;
		}
	}

	const response = await heyGenApiRequest.call(
		this,
		'POST',
		'/video_agent/generate',
		body,
		{},
		{},
		'api',
		'v1',
	);

	return response;
}

export async function translateVideoApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const videoUrl = this.getNodeParameter('videoUrl', i) as string;
	const audioUrl = this.getNodeParameter('audioUrl', i, '') as string;
	const useMultipleLanguages = this.getNodeParameter('useMultipleLanguages', i, false) as boolean;

	if (!videoUrl && !audioUrl) {
		throw new NodeOperationError(this.getNode(), 'Either video_url or audio_url must be provided.');
	}

	const body: IDataObject = {};

	if (videoUrl) {
		body.video_url = videoUrl;
	}
	if (audioUrl) {
		body.audio_url = audioUrl;
	}

	// Handle output languages
	if (useMultipleLanguages) {
		const outputLanguages = this.getNodeParameter('outputLanguages', i, []) as string[];
		if (outputLanguages.length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one output language must be provided when using multiple languages.');
		}
		body.output_languages = outputLanguages;
	} else {
		const outputLanguage = this.getNodeParameter('outputLanguage', i, '') as string;
		if (!outputLanguage && !audioUrl) {
			throw new NodeOperationError(this.getNode(), 'Either output_language or output_languages must be provided (unless audio_url is provided).');
		}
		if (outputLanguage) {
			body.output_language = outputLanguage;
		}
	}

	// Additional fields
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	if (additionalFields.title) {
		body.title = additionalFields.title;
	}
	if (additionalFields.inputLanguage) {
		body.input_language = additionalFields.inputLanguage;
	}
	if (additionalFields.translateAudioOnly !== undefined) {
		body.translate_audio_only = additionalFields.translateAudioOnly;
	}
	if (additionalFields.speakerNum !== undefined) {
		body.speaker_num = additionalFields.speakerNum;
	}
	if (additionalFields.callbackId) {
		body.callback_id = additionalFields.callbackId;
	}
	if (additionalFields.brandVoiceId) {
		body.brand_voice_id = additionalFields.brandVoiceId;
	}
	if (additionalFields.checkCreditsSync !== undefined) {
		body.check_credits_sync = additionalFields.checkCreditsSync;
	}
	if (additionalFields.enableDynamicDuration !== undefined) {
		body.enable_dynamic_duration = additionalFields.enableDynamicDuration;
	}
	if (additionalFields.callbackUrl) {
		body.callback_url = additionalFields.callbackUrl;
	}
	if (additionalFields.fpsMode) {
		body.fps_mode = additionalFields.fpsMode;
	}
	if (additionalFields.validateOnly !== undefined) {
		body.validate_only = additionalFields.validateOnly;
	}
	if (additionalFields.folderId) {
		body.folder_id = additionalFields.folderId;
	}
	if (additionalFields.srtUrl) {
		body.srt_url = additionalFields.srtUrl;
	}
	if (additionalFields.srtRole) {
		body.srt_role = additionalFields.srtRole;
	}
	if (additionalFields.mode) {
		body.mode = additionalFields.mode;
	}
	if (additionalFields.useDisguisedVoice !== undefined) {
		body.use_disguised_voice = additionalFields.useDisguisedVoice;
	}
	if (additionalFields.enableCaption !== undefined) {
		body.enable_caption = additionalFields.enableCaption;
	}
	if (additionalFields.keepTheSameFormat !== undefined) {
		body.keep_the_same_format = additionalFields.keepTheSameFormat;
	}
	if (additionalFields.disableMusicTrack !== undefined) {
		body.disable_music_track = additionalFields.disableMusicTrack;
	}
	if (additionalFields.enableSpeechEnhancement !== undefined) {
		body.enable_speech_enhancement = additionalFields.enableSpeechEnhancement;
	}
	if (additionalFields.enableWatermark !== undefined) {
		body.enable_watermark = additionalFields.enableWatermark;
	}
	if (additionalFields.startTime !== undefined) {
		body.start_time = additionalFields.startTime;
	}
	if (additionalFields.endTime !== undefined) {
		body.end_time = additionalFields.endTime;
	}
	if (additionalFields.createCollection !== undefined) {
		body.create_collection = additionalFields.createCollection;
	}

	return await heyGenApiRequest.call(
		this,
		'POST',
		'/video_translate',
		body,
		{},
		{},
		'api',
		'v2',
	);
}