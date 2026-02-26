import type { INodeProperties } from 'n8n-workflow';

export const createVideoAgentDescription: INodeProperties[] = [
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createVideoAgent'],
			},
		},
		default: '',
		description: 'The prompt describing the video to create (1-10000 characters)',
		typeOptions: {
			rows: 4,
		},
	},
	{
		displayName: 'Config',
		name: 'config',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['createVideoAgent'],
			},
		},
		default: {},
		description: 'Optional configuration for the video',
		options: [
			{
				name: 'configValues',
				displayName: 'Config',
				values: [
					{
						displayName: 'Duration (Seconds)',
						name: 'duration_sec',
						type: 'number',
						default: 60,
						description: 'Duration of the video in seconds (minimum 5 seconds)',
						typeOptions: {
							minValue: 5,
						},
					},
					{
						displayName: 'Orientation',
						name: 'orientation',
						type: 'options',
						options: [
							{
								name: 'Landscape',
								value: 'landscape',
							},
							{
								name: 'Portrait',
								value: 'portrait',
							},
						],
						default: 'landscape',
						description: 'Video orientation',
					},
					{
						displayName: 'Avatar ID',
						name: 'avatar_id',
						type: 'string',
						default: '',
						description: 'Specific avatar ID to use for the video',
					},
				],
			},
		],
	},
];
