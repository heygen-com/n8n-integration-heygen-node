import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/** POST /v3/videos body for Create Video (advanced) operation — parameters prefixed to avoid clashes in merged HeyGen node. */
export function buildPostV3VideosBody(this: IExecuteFunctions, i: number): IDataObject {
	const useJson = this.getNodeParameter('videosUseJsonBody', i, false) as boolean;
	if (useJson) {
		const raw = this.getNodeParameter('videosJsonBody', i, '{}') as string;
		let parsed: unknown;
		try {
			parsed = JSON.parse(raw);
		} catch {
			throw new NodeOperationError(this.getNode(), 'JSON Body must be valid JSON.');
		}
		if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
			throw new NodeOperationError(this.getNode(), 'JSON Body must be a JSON object.');
		}
		return parsed as IDataObject;
	}

	const body: IDataObject = {};

	const additional = this.getNodeParameter('videosAdditionalFields', i, {}) as IDataObject;
	body.test = (additional.test as boolean) ?? false;

	const optionalFields = ['title', 'callbackId', 'callbackUrl', 'folderId'] as const;
	for (const field of optionalFields) {
		const value = additional[field] as string | undefined;
		if (value) body[field.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
	}

	const dimension = this.getNodeParameter('videosDimension', i) as IDataObject;
	const dim = (dimension?.dimensionValues ?? { width: 1280, height: 720 }) as IDataObject;
	const w = Number(dim.width) || 1280;
	const h = Number(dim.height) || 720;
	body.aspect_ratio = h > w ? '9:16' : '16:9';
	body.resolution = h >= 1080 ? '1080p' : '720p';

	const visualSource = this.getNodeParameter('videosVisualSource', i) as string;
	const avatarId = this.getNodeParameter('videosAvatarId', i, '') as string;
	const imageUrl = this.getNodeParameter('videosImageUrl', i, '') as string;
	const imageAssetId = this.getNodeParameter('videosImageAssetId', i, '') as string;

	if (visualSource === 'avatarId') {
		if (!avatarId?.trim()) {
			throw new NodeOperationError(this.getNode(), 'Avatar ID is required when Visual Source is Avatar ID.');
		}
		body.avatar_id = avatarId.trim();
	} else if (visualSource === 'imageUrl') {
		if (!imageUrl?.trim()) {
			throw new NodeOperationError(this.getNode(), 'Image URL is required when Visual Source is Image URL.');
		}
		body.image_url = imageUrl.trim();
	} else if (visualSource === 'imageAssetId') {
		if (!imageAssetId?.trim()) {
			throw new NodeOperationError(
				this.getNode(),
				'Image Asset ID is required when Visual Source is Image Asset ID.',
			);
		}
		body.image_asset_id = imageAssetId.trim();
	} else {
		throw new NodeOperationError(this.getNode(), 'Select a valid Visual Source.');
	}

	const videoType = this.getNodeParameter('videosVideoType', i, 'avatar') as string;
	body.type = videoType || 'avatar';

	const voiceMode = this.getNodeParameter('videosVoiceMode', i, 'text') as string;
	if (voiceMode === 'text') {
		const script = this.getNodeParameter('videosScript', i, '') as string;
		const voiceId = this.getNodeParameter('videosVoiceId', i, '') as string;
		if (script) body.script = script;
		if (voiceId) body.voice_id = voiceId;
		const speed = this.getNodeParameter('videosVoiceSpeed', i, 1) as number;
		body.voice_settings = { speed: speed ?? 1.0 };
	} else if (voiceMode === 'audio') {
		const audioUrl = this.getNodeParameter('videosAudioUrl', i, '') as string;
		if (audioUrl) body.audio_url = audioUrl;
	}

	const backgroundType = this.getNodeParameter('videosBackgroundType', i, 'none') as string;
	if (backgroundType === 'color') {
		body.background = {
			type: 'color',
			value: (this.getNodeParameter('videosBackgroundColor', i, '#f6f6fc') as string) || '#f6f6fc',
		};
	} else if (backgroundType === 'image') {
		body.background = {
			type: 'image',
			url: this.getNodeParameter('videosBackgroundImageUrl', i, '') as string,
		};
	} else if (backgroundType === 'video') {
		body.background = {
			type: 'image',
			url: this.getNodeParameter('videosBackgroundVideoUrl', i, '') as string,
		};
	}

	if (this.getNodeParameter('videosCaption', i, false) as boolean) {
		body.enable_caption = true;
	}

	return body;
}
