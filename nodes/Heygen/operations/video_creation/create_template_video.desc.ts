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
		},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createTemplateVideo'],
			},
		},
		default: '',
		description: 'Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		description: 'Template ID - use this field to override (if needed) template ID from the list above. If don\'t need - just skip this field.',
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
						displayName: 'Variable Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Unique key to be used as the object key (e.g. script_en)',
					},
					/*
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name value inside the object',
					},*/
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Text', value: 'text' },
							{ name: 'Voice', value: 'voice' },
						],
						default: 'text',
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
				],
			},
		],
	},

	// Add other optional fields here
];
