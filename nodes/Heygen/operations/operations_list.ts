/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

export const heygenResource: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Video', value: 'video' },
		{ name: 'List', value: 'list' },
		{ name: 'Asset', value: 'asset' },
	],
	default: 'video',
};

export const heygenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['video'] } },
		options: [
			{ name: 'Create Avatar Video', value: 'createAvatarVideo', action: 'Create avatar video a video' },
			{ name: 'Create Template Video', value: 'createTemplateVideo', action: 'Create template video a video' },
			{ name: 'Get Video Status', value: 'getVideoStatus', action: 'Get video status a video' },
		],
		default: 'createAvatarVideo',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['list'] } },
		options: [
			{ name: 'List Avatars', value: 'listAvatars', action: 'List avatars a list' },
			{ name: 'List Avatars Groups', value: 'listAvatarsGroups', action: 'List avatars groups a list' },
			{ name: 'List Voices', value: 'listVoices', action: 'List voices a list' },
		],
		default: 'listAvatars',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['asset'] } },
		options: [{ name: 'Upload Assets', value: 'uploadAssets', action: 'Upload assets an asset' }],
		default: 'uploadAssets',
	},
];
