import type { INodeProperties } from 'n8n-workflow';

// some common fields are defined in 'create_avatar_video_desc'
// in this file only specific for templates video generation
export const createTemplateVideoDescription: INodeProperties[] = [
	{
		displayName: 'Template Name or ID',
		name: 'templateIDOptions',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTemplatesList',
			loadOptionsDependsOn: ['authentication'],
		},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createTemplateVideo'],
			},
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Template ID (Manual Input)',
		name: 'templateIDString',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createTemplateVideo'],
			},
		},
		default: '',
		description:
			'Optional override: enter a template_id directly if it is not in the list (for example another API key’s space). When set, this takes precedence over Template Name or ID above.',
	},
	{
		displayName: 'Enable Sharing',
		name: 'enableSharing',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createTemplateVideo'],
			},
		},
		default: false,
		description: 'Whether make the video publicly shareable immediately after creation',
	},
	{
		displayName: 'Template Variables',
		name: 'templateVariables',
		type: 'fixedCollection',
		placeholder: 'Add Variable',
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createTemplateVideo'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Variable',
				name: 'variable',
				values: [
					{
						displayName: 'Audio Asset ID',
						name: 'audioAssetId',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['audio'],
							},
						},
					},
					{
						displayName: 'Character ID',
						name: 'characterId',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['character'],
							},
						},
						description: 'Maps to properties.character_id',
					},
					{
						displayName: 'Character Kind',
						name: 'characterKind',
						type: 'options',
						options: [{ name: 'Avatar', value: 'avatar' }],
						default: 'avatar',
						displayOptions: {
							show: {
								type: ['character'],
							},
						},
						description: 'Maps to properties.type in the API',
					},
					{
						displayName: 'Image Asset ID',
						name: 'imageAssetId',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['image'],
							},
						},
						description: 'HeyGen asset ID for the image',
					},
					{
						displayName: 'Image Fit',
						name: 'imageFit',
						type: 'options',
						options: [
							{ name: 'Cover', value: 'cover' },
							{ name: 'Contain', value: 'contain' },
						],
						default: 'cover',
						displayOptions: {
							show: {
								type: ['image'],
							},
						},
					},
					{
						displayName: 'Locale',
						name: 'voiceLocale',
						type: 'string',
						default: '',
						placeholder: 'en-US',
						displayOptions: {
							show: {
								type: ['voice'],
							},
						},
						description: 'Optional BCP-47 locale (e.g. en-US)',
					},
					{
						displayName: 'Play Style',
						name: 'videoPlayStyle',
						type: 'options',
						options: [
							{ name: 'Loop', value: 'loop' },
							{ name: 'Once', value: 'once' },
						],
						default: 'loop',
						displayOptions: {
							show: {
								type: ['video'],
							},
						},
					},
					{
						displayName: 'Text Content',
						name: 'textContent',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['text'],
							},
						},
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Audio', value: 'audio' },
							{ name: 'Character', value: 'character' },
							{ name: 'Image', value: 'image' },
							{ name: 'Text', value: 'text' },
							{ name: 'Video', value: 'video' },
							{ name: 'Voice', value: 'voice' },
						],
						default: 'text',
					},
					{
						displayName: 'Variable Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Must match the template slot key (e.g. HEADLINE)',
					},
					{
						displayName: 'Video Fit',
						name: 'videoFit',
						type: 'options',
						options: [
							{ name: 'Cover', value: 'cover' },
							{ name: 'Contain', value: 'contain' },
						],
						default: 'contain',
						displayOptions: {
							show: {
								type: ['video'],
							},
						},
					},
					{
						displayName: 'Video URL',
						name: 'videoUrl',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['video'],
							},
						},
					},
					{
						displayName: 'Voice ID',
						name: 'voiceId',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['voice'],
							},
						},
					},
					{
						displayName: 'Volume',
						name: 'videoVolume',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
						default: 1,
						displayOptions: {
							show: {
								type: ['video'],
							},
						},
						description: '0–1 (e.g. 0.5 for background music)',
					},
				],
			},
		],
	},

	// Add other optional fields here
];
