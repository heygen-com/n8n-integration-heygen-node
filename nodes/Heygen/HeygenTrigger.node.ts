import type {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { handleHeygenWebhookEvent } from './operations/webhooks/webhook';

export class HeygenTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HeyGen Trigger',
		name: 'heygenTrigger',
		icon: 'file:heygen.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts a workflow when HeyGen sends a webhook event',
		defaults: { name: 'HeyGen Trigger' },

		inputs: [],
		outputs: [NodeConnectionType.Main],

		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'heygen',
				isFullPath: false,
			},
		],

		properties: [
			{
				displayName: 'Event Types',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Avatar Video Success',
						value: 'avatar_video.success',
					},
					{
						name: 'Avatar Video Fail',
						value: 'avatar_video.fail',
					},
					{
						name: 'Avatar Video GIF Success',
						value: 'avatar_video_gif.success',
					},
					{
						name: 'Avatar Video GIF Fail',
						value: 'avatar_video_gif.fail',
					},
					{
						name: 'Video Translate Success',
						value: 'video_translate.success',
					},
					{
						name: 'Video Translate Fail',
						value: 'video_translate.fail',
					},
					{
						name: 'Personalized Video',
						value: 'personalized_video',
					},
					{
						name: 'Instant Avatar Success',
						value: 'instant_avatar.success',
					},
					{
						name: 'Instant Avatar Fail',
						value: 'instant_avatar.fail',
					},
					{
						name: 'Photo Avatar Generation Success',
						value: 'photo_avatar_generation.success',
					},
					{
						name: 'Photo Avatar Generation Fail',
						value: 'photo_avatar_generation.fail',
					},
					{
						name: 'Photo Avatar Train Success',
						value: 'photo_avatar_train.success',
					},
					{
						name: 'Photo Avatar Train Fail',
						value: 'photo_avatar_train.fail',
					},
					{
						name: 'Photo Avatar Add Motion Success',
						value: 'photo_avatar_add_motion.success',
					},
					{
						name: 'Photo Avatar Add Motion Fail',
						value: 'photo_avatar_add_motion.fail',
					},
				],
				default: [],
				description: 'Select which events to listen to. Leave empty to listen to all events.',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		if (typeof body?.event !== 'string') {
			throw new NodeOperationError(this.getNode(), 'Missing or invalid "event" field in webhook payload.');
		}

		const event = body.event as string;
		
		const selectedEvents = this.getNodeParameter('events', []) as string[];
		if (selectedEvents.length > 0 && !selectedEvents.includes(event)) {
			return {
				workflowData: [[]],
			};
		}

		const message = handleHeygenWebhookEvent(event);

		return {
			workflowData: [[{ json: { event, message, payload: body } }]],
		};
	}
}
