import type { INodeProperties } from 'n8n-workflow';
//import { heyGenApiRequest } from '../../shared/shared_functions';
//import { getAvatars } from './methods/getLists'



export const createAvatarVideoDescription: INodeProperties[] = [
	// Create Video Parameters
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['createAvatarVideo','createTemplateVideo'],
			},
		},
		default: false,
		description: 'Whether to add a caption to the video. Default is False. Only text input supports caption',
	},
	{
		displayName: 'Test',
		name: 'test',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['createAvatarVideo'],
			},
		},
		default: false,
		description: 'Test option, will not consume credits but will draw HeyGen watermark. Limited availability per day.',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createAvatarVideo','createTemplateVideo'],
			},
		},
		default: '',
		description: 'Title for the video',
	},
	{
		displayName: 'Callback ID',
		name: 'callbackId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createAvatarVideo'],
			},
		},
		default: '',
		description: 'A custom ID for callback purposes',
	},
	{
		displayName: 'Callback URL',
		name: 'callbackUrl',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createAvatarVideo','createTemplateVideo'],
			},
		},
		default: '',
		description: 'An optional callback URL to receive a notification when the video is ready',
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createAvatarVideo','createTemplateVideo'],
			},
		},
		default: '',
		description: 'Specify the video output folder destination',
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
						displayName: 'Avatar ID',
						name: 'avatarId',
						type: 'string',
						//typeOptions: {
						//	loadOptionsMethod: 'getAvatars',
						//},
						displayOptions: {
							show: {
								characterType: ['avatar'],
							},
						},
						default: '',
					},
					{
						displayName: 'Talking Photo ID',
						name: 'talkingPhotoId',
						type: 'string',
						displayOptions: {
							show: {
								characterType: ['talking_photo'],
							},
						},
						default: '',
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
					{
						displayName: 'Voice ID',
						name: 'voiceId',
						type: 'string',
						displayOptions: {
							show: {
								voiceType: ['text'],
							},
						},
						default: '',
						description: 'Voice ID to use for text-to-speech',
					},
					{
						displayName: 'Input Text',
						name: 'inputText',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						displayOptions: {
							show: {
								voiceType: ['text'],
							},
						},
						default: '',
						description: 'Text that the character will speak',
					},
					{
						displayName: 'Voice Speed',
						name: 'speed',
						type: 'number',
						typeOptions: {
							minValue: 0.5,
							maxValue: 1.5,
						},
						displayOptions: {
							show: {
								voiceType: ['text'],
							},
						},
						default: 1,
						description: 'Speed of the voice, between 0.5 and 1.5',
					},
					{
						displayName: 'Audio URL',
						name: 'audioUrl',
						type: 'string',
						displayOptions: {
							show: {
								voiceType: ['audio'],
							},
						},
						default: '',
						description: 'URL of the audio file to use',
					},
					{
						displayName: 'Silence Duration',
						name: 'duration',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						displayOptions: {
							show: {
								voiceType: ['silence'],
							},
						},
						default: 1,
						description: 'Duration of silence in seconds (1-100)',
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
						displayName: 'Background Color',
						name: 'backgroundColor',
						type: 'color',
						displayOptions: {
							show: {
								backgroundType: ['color'],
							},
						},
						default: '#f6f6fc',
						description: 'Color to use as background (hex format)',
					},
					{
						displayName: 'Background Image URL',
						name: 'backgroundImageUrl',
						type: 'string',
						displayOptions: {
							show: {
								backgroundType: ['image'],
							},
						},
						default: '',
						description: 'URL of the image to use as background',
					},
					{
						displayName: 'Background Video URL',
						name: 'backgroundVideoUrl',
						type: 'string',
						displayOptions: {
							show: {
								backgroundType: ['video'],
							},
						},
						default: '',
						description: 'URL of the video to use as background',
					},
				],
			},
		],
		description: 'Video input settings (scenes). Each input describes a scene in the video.',
	},
];
