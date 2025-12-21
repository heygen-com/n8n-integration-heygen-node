import type { INodeProperties } from 'n8n-workflow';

export const getAvatarsList: INodeProperties[] = [
	// omit fields
];


export const getAvatarsGroupsList: INodeProperties[] = [
	{
		displayName: 'Include Public Groups',
		name: 'includePublic',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['listAvatarsGroups'],
			},
		},
		default: false,
		description: 'Whether to include all public avatar groups',
	},
];


export const getVoicesList: INodeProperties[] = [
	// omit fields
];


