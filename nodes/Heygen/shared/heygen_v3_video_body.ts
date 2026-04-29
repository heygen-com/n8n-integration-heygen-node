import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * Builds POST /v3/videos JSON body from the Create Avatar Video node (single-scene).
 * HeyGen v3 uses a flat avatar/video + script/audio model (not v2 `video_inputs` arrays).
 */
export function buildCreateAvatarVideoV3Body(
	this: IExecuteFunctions,
	i: number,
): IDataObject {
	const body: IDataObject = {};

	body.test = this.getNodeParameter('additionalFields.test', i, false) as boolean;

	const optionalFields = ['title', 'callbackId', 'callbackUrl', 'folderId'];
	for (const field of optionalFields) {
		const value = this.getNodeParameter(`additionalFields.${field}`, i, '') as string;
		if (value) body[field.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
	}

	const dimension = this.getNodeParameter('dimension', i) as IDataObject;
	const dim = (dimension?.dimensionValues ?? { width: 1280, height: 720 }) as IDataObject;
	const w = Number(dim.width) || 1280;
	const h = Number(dim.height) || 720;
	body.aspect_ratio = h > w ? '9:16' : '16:9';
	body.resolution = h >= 1080 ? '1080p' : '720p';

	const videoInputs = this.getNodeParameter('videoInput.videoInputValues', i, []) as IDataObject[];
	if (!videoInputs.length) {
		throw new NodeOperationError(this.getNode(), 'At least one video input scene is required');
	}
	if (videoInputs.length > 1) {
		throw new NodeOperationError(
			this.getNode(),
			'HeyGen API v3 supports one scene per request in this node. Use multiple HeyGen nodes or combine scenes in HeyGen Studio, then export.',
		);
	}

	const input = videoInputs[0];

	if (input.characterType === 'avatar') {
		body.type = 'avatar';
		body.avatar_id = input.avatarId;
	} else if (input.characterType === 'talking_photo') {
		body.type = 'avatar';
		body.avatar_id = input.talkingPhotoId;
	} else {
		throw new NodeOperationError(this.getNode(), 'Unsupported character type for v3 video create');
	}

	if (input.voiceType === 'text') {
		body.script = input.inputText;
		body.voice_id = input.voiceId;
		body.voice_settings = {
			speed: input.speed ?? 1.0,
		};
	} else if (input.voiceType === 'audio') {
		body.audio_url = input.audioUrl;
	} else if (input.voiceType === 'silence') {
		throw new NodeOperationError(
			this.getNode(),
			'Voice type “silence” is not supported with HeyGen API v3 in this node. Use text or audio voice, or generate via HeyGen Studio.',
		);
	}

	if (input.backgroundType === 'color') {
		body.background = {
			type: 'color',
			value: input.backgroundColor || '#f6f6fc',
		};
	} else if (input.backgroundType === 'image') {
		body.background = {
			type: 'image',
			url: input.backgroundImageUrl,
		};
	} else if (input.backgroundType === 'video') {
		body.background = {
			type: 'image',
			url: input.backgroundVideoUrl,
		};
	}

	const caption = this.getNodeParameter('caption', i) as boolean;
	if (caption) {
		body.enable_caption = true;
	}

	return body;
}

/** Builds POST /v3/video-translations JSON body from the Translate Video node. */
export function buildTranslateVideoV3Body(this: IExecuteFunctions, i: number): IDataObject {
	const videoUrl = this.getNodeParameter('videoUrl', i) as string;
	const audioUrl = this.getNodeParameter('audioUrl', i, '') as string;
	const useMultipleLanguages = this.getNodeParameter('useMultipleLanguages', i, false) as boolean;

	if (!videoUrl && !audioUrl) {
		throw new NodeOperationError(this.getNode(), 'Either video URL or audio URL must be provided.');
	}

	const body: IDataObject = {};

	if (videoUrl) {
		body.video = { type: 'url', url: videoUrl };
	}
	if (audioUrl) {
		body.audio = { type: 'url', url: audioUrl };
	}

	if (useMultipleLanguages) {
		const outputLanguages = this.getNodeParameter('outputLanguages', i, []) as string[];
		if (outputLanguages.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one output language is required when using multiple languages.',
			);
		}
		body.output_languages = outputLanguages;
	} else {
		const outputLanguage = this.getNodeParameter('outputLanguage', i, '') as string;
		if (!outputLanguage && !audioUrl) {
			throw new NodeOperationError(
				this.getNode(),
				'Either output language or output languages must be set (unless you only provide an audio URL).',
			);
		}
		if (outputLanguage) {
			body.output_languages = [outputLanguage];
		}
	}

	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const passthrough: Record<string, string> = {
		title: 'title',
		inputLanguage: 'input_language',
		translateAudioOnly: 'translate_audio_only',
		speakerNum: 'speaker_num',
		callbackId: 'callback_id',
		brandVoiceId: 'brand_voice_id',
		checkCreditsSync: 'check_credits_sync',
		enableDynamicDuration: 'enable_dynamic_duration',
		callbackUrl: 'callback_url',
		fpsMode: 'fps_mode',
		validateOnly: 'validate_only',
		folderId: 'folder_id',
		srtUrl: 'srt_url',
		srtRole: 'srt_role',
		mode: 'mode',
		useDisguisedVoice: 'use_disguised_voice',
		enableCaption: 'enable_caption',
		keepTheSameFormat: 'keep_the_same_format',
		disableMusicTrack: 'disable_music_track',
		enableSpeechEnhancement: 'enable_speech_enhancement',
		enableWatermark: 'enable_watermark',
		startTime: 'start_time',
		endTime: 'end_time',
		createCollection: 'create_collection',
	};

	for (const [uiKey, apiKey] of Object.entries(passthrough)) {
		const v = additionalFields[uiKey];
		if (v === undefined || v === null) {
			continue;
		}
		if (typeof v === 'boolean') {
			body[apiKey] = v;
			continue;
		}
		if (v !== '') {
			body[apiKey] = v;
		}
	}

	return body;
}
