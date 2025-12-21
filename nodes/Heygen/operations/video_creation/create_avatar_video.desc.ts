/* eslint-disable n8n-nodes-base/node-param-description-boolean-without-whether */

import type { INodeProperties } from 'n8n-workflow';


export const createAvatarVideoDescription: INodeProperties[] = [
	// Create Video Parameters
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createAvatarVideo','createTemplateVideo'],
			},
		},
		default: false,
		description: 'Whether to add a caption to the video. Default is False. Only text input supports caption',
	},
	{
		displayName: 'Video Dimensions',
		name: 'dimension',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createAvatarVideo','createTemplateVideo'],
			},
		},
		default: {},
		options: [
			{
				name: 'dimensionValues',
				displayName: 'Dimension',
				values: [
					{
						displayName: 'Width',
						name: 'width',
						type: 'number',
						default: 1280,
						description: 'Width of the video in pixels',
					},
					{
						displayName: 'Height',
						name: 'height',
						type: 'number',
						default: 720,
						description: 'Height of the video in pixels',
					},
				],
			},
		],
		description: 'The dimensions of the output video',
	},
	{
		displayName: 'Video Input Scenes',
		name: 'videoInput',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createAvatarVideo'],
			},
		},
		default: {},
		options: [
			{
				name: 'videoInputValues',
				displayName: 'Video Input',
				values: [
					{
						displayName: 'Audio URL',
						name: 'audioUrl',
						type: 'string',
						default: '',
						description: 'URL of the audio file to use',
					},
					{
						displayName: 'Avatar ID',
						name: 'avatarId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Background Color',
						name: 'backgroundColor',
						type: 'color',
						default: '#f6f6fc',
						description: 'Color to use as background (hex format)',
					},
					{
						displayName: 'Background Image URL',
						name: 'backgroundImageUrl',
						type: 'string',
						default: '',
						description: 'URL of the image to use as background',
					},
					{
						displayName: 'Background Type',
						name: 'backgroundType',
						type: 'options',
						options: [
							{
								name: 'Color',
								value: 'color',
							},
							{
								name: 'Image',
								value: 'image',
							},
							{
								name: 'Video',
								value: 'video',
							},
						],
						default: 'color',
						description: 'Type of background to use',
					},
					{
						displayName: 'Background Video URL',
						name: 'backgroundVideoUrl',
						type: 'string',
						default: '',
						description: 'URL of the video to use as background',
					},
					{
						displayName: 'Character Type',
						name: 'characterType',
						type: 'options',
						options: [
							{
								name: 'Avatar',
								value: 'avatar',
							},
							{
								name: 'Talking Photo',
								value: 'talking_photo',
							},
					],
						default: 'avatar',
						description: 'Type of character to use in the video',
					},
					{
						displayName: 'Input Text',
						name: 'inputText',
						type: 'string',
						default: '',
						description: 'Text that the character will speak',
					},
					{
						displayName: 'Silence Duration',
						name: 'duration',
						type: 'number',
						default: 1,
						description: 'Duration of silence in seconds (1-100)',
					},
					{
						displayName: 'Talking Photo ID',
						name: 'talkingPhotoId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Voice ID',
						name: 'voiceId',
						type: 'string',
						default: '',
						description: 'Voice ID to use for text-to-speech',
					},
					{
						displayName: 'Voice Speed',
						name: 'speed',
						type: 'number',
						default: 1,
						description: 'Speed of the voice, between 0.5 and 1.5',
					},
					{
						displayName: 'Voice Type',
						name: 'voiceType',
						type: 'options',
						options: [
							{
								name: 'Text',
								value: 'text',
							},
							{
								name: 'Audio',
								value: 'audio',
							},
							{
								name: 'Silence',
								value: 'silence',
							},
					],
						default: 'text',
						description: 'Type of voice input for the character',
					},
			],
			},
		],
		description: 'Video input settings (scenes). Each input describes a scene in the video.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createAvatarVideo', 'createTemplateVideo'],
			},
		},
		options: [
			{ displayName: 'Callback ID', name: 'callbackId', type: 'string', default: '' },
			{ displayName: 'Callback URL', name: 'callbackUrl', type: 'string', default: '' },
			{ displayName: 'Folder ID', name: 'folderId', type: 'string', default: '' },
			{
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: false,
				description: 'Test option, will not consume credits but will draw HeyGen watermark',
			},
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
		],
	},

];
