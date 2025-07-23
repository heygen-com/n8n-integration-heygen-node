import type { INodeProperties } from 'n8n-workflow';

export const heygenOperations: INodeProperties = {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Create Avatar Video', value: 'createAvatarVideo' },
			{ name: 'Create Template Video', value: 'createTemplateVideo' },
			{ name: 'Get Video Status', value: 'getVideoStatus' },
			{ name: 'Webhook Triggers', value: 'webhook' },
			{ name: 'List Avatars', value: 'listAvatars' },
			{ name: 'List Avatars Groups', value: 'listAvatarsGroups' },
			{ name: 'List Voices', value: 'listVoices' },
			{ name: 'Upload Assets', value: 'uploadAssets' },
			
		],
		default: 'createAvatarVideo',
	}