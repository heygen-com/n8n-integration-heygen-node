/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

export const heygenResource: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Video', value: 'video' },
		{ name: 'Lists', value: 'lists' },
		{ name: 'Assets', value: 'assets' },
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
			{ name: 'Create Avatar Video', value: 'createAvatarVideo' },
			{ name: 'Create Template Video', value: 'createTemplateVideo' },
			{ name: 'Get Video Status', value: 'getVideoStatus' },
		],
		default: 'createAvatarVideo',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['lists'] } },
		options: [
			{ name: 'List Avatars', value: 'listAvatars' },
			{ name: 'List Avatars Groups', value: 'listAvatarsGroups' },
			{ name: 'List Voices', value: 'listVoices' },
		],
		default: 'listAvatars',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['assets'] } },
		options: [{ name: 'Upload Assets', value: 'uploadAssets' }],
		default: 'uploadAssets',
	},
];
