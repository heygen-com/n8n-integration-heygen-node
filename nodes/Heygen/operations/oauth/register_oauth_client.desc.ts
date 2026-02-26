import type { INodeProperties } from 'n8n-workflow';

export const registerOAuthClientDescription: INodeProperties[] = [
	{
		displayName: 'Note',
		name: 'note',
		type: 'notice',
		displayOptions: {
			show: {
				resource: ['oauth'],
				operation: ['registerOAuthClient'],
			},
		},
		default: '',
		description: 'This operation will register a new OAuth client and return a client_id. Copy the client_id from the output and paste it into the Client ID field in your HeyGen OAuth2 credentials.',
	},
];
