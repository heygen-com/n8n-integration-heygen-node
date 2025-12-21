import type { INodeProperties } from 'n8n-workflow';

export const getVideoStatus: INodeProperties[] = [
	// Create Video Parameters
	{
		displayName: 'Video ID',
		name: 'videoId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getVideoStatus'],
			},
		},
		default: "input video id",
		description: 'Video ID to get status',
	},
];
