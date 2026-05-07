/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

export const heygenResource: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Asset', value: 'asset' },
		{ name: 'Avatar', value: 'avatar' },
		{ name: 'List', value: 'list' },
		{ name: 'Lipsync', value: 'lipsync' },
		{ name: 'OAuth', value: 'oauth' },
		{ name: 'Video', value: 'video' },
		{ name: 'Video Agent', value: 'videoAgent' },
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
			{ name: 'Create Video', value: 'createVideo', action: 'Create a video' },
			{ name: 'Delete Video', value: 'deleteVideo', action: 'Delete a video' },
			{ name: 'Get Video', value: 'getVideoStatus', action: 'Get a video' },
			{ name: 'List Videos', value: 'listVideos', action: 'List videos' },
			{ name: 'Translate Video', value: 'translateVideo', action: 'Translate video a video' },
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
			{ name: 'Design a Voice', value: 'designVoice', action: 'Design a voice' },
			{ name: 'Generate Speech', value: 'generateSpeech', action: 'Generate speech' },
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
		displayOptions: { show: { resource: ['avatar'] } },
		options: [{ name: 'Create Avatar', value: 'createAvatar', action: 'Create an avatar' }],
		default: 'createAvatar',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['videoAgent'] } },
		options: [
			{
				name: 'Create Session',
				value: 'createVideoAgentSession',
				action: 'Create a video agent session',
			},
			{ name: 'List Sessions', value: 'listVideoAgentSessions', action: 'List video agent sessions' },
			{ name: 'List Styles', value: 'listVideoAgentStyles', action: 'List video agent styles' },
		],
		default: 'createVideoAgentSession',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['lipsync'] } },
		options: [
			{ name: 'Create Lipsync', value: 'createLipsync', action: 'Create a lipsync job' },
			{ name: 'Delete Lipsync', value: 'deleteLipsync', action: 'Delete a lipsync job' },
			{ name: 'Get Lipsync', value: 'getLipsync', action: 'Get a lipsync job' },
			{ name: 'List Lipsyncs', value: 'listLipsyncs', action: 'List lipsync jobs' },
			{ name: 'Update Lipsync', value: 'updateLipsync', action: 'Update a lipsync job' },
		],
		default: 'listLipsyncs',
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
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['oauth'] } },
		options: [
			{
				name: 'Register OAuth Client',
				value: 'registerOAuthClient',
				action: 'Register oauth client an oauth',
			},
		],
		default: 'registerOAuthClient',
	},
];
