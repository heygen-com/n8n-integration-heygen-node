/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

const rl = { resource: ['list'] };
const rva = { resource: ['videoAgent'] };

const listPaginationShow: INodeProperties['displayOptions'] = {
	show: {
		resource: ['video', 'list', 'videoAgent', 'lipsync'],
		operation: [
			'listVideos',
			'listVoices',
			'listAvatars',
			'listAvatarsGroups',
			'listVideoAgentSessions',
			'listVideoAgentStyles',
			'listLipsyncs',
		],
	},
};

export const getAvatarsList: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'avatarLooksGroupId',
		type: 'string',
		default: '',
		displayOptions: { show: { ...rl, operation: ['listAvatars'] } },
		description: 'Only return looks for this avatar group',
	},
	{
		displayName: 'Avatar Type',
		name: 'avatarLooksAvatarType',
		type: 'options',
		options: [
			{ name: 'Any', value: 'any' },
			{ name: 'Digital Twin', value: 'digital_twin' },
			{ name: 'Photo Avatar', value: 'photo_avatar' },
			{ name: 'Studio Avatar', value: 'studio_avatar' },
		],
		default: 'any',
		displayOptions: { show: { ...rl, operation: ['listAvatars'] } },
	},
	{
		displayName: 'Ownership',
		name: 'avatarLooksOwnership',
		type: 'options',
		options: [
			{ name: 'Any', value: 'any' },
			{ name: 'Private', value: 'private' },
			{ name: 'Public', value: 'public' },
		],
		default: 'any',
		displayOptions: { show: { ...rl, operation: ['listAvatars'] } },
	},
];

export const getAvatarsGroupsList: INodeProperties[] = [
	{
		displayName: 'Ownership',
		name: 'avatarGroupsOwnership',
		type: 'options',
		options: [
			{ name: 'Any', value: 'any' },
			{ name: 'Private', value: 'private' },
			{ name: 'Public', value: 'public' },
		],
		default: 'any',
		displayOptions: { show: { ...rl, operation: ['listAvatarsGroups'] } },
		description: 'Filter groups by ownership',
	},
];

export const getVoicesList: INodeProperties[] = [
	{
		displayName: 'Voice Library',
		name: 'voiceLibraryType',
		type: 'options',
		options: [
			{ name: 'Public', value: 'public' },
			{ name: 'Private', value: 'private' },
		],
		default: 'public',
		displayOptions: { show: { ...rl, operation: ['listVoices'] } },
	},
	{
		displayName: 'Engine Filter',
		name: 'engineFilter',
		type: 'options',
		options: [
			{
				name: 'Starfish Only (Compatible with Generate Speech)',
				value: 'starfish',
			},
			{ name: 'Any Engine', value: 'any' },
			{ name: 'Custom', value: 'custom' },
		],
		default: 'starfish',
		displayOptions: { show: { ...rl, operation: ['listVoices'] } },
		description:
			'Generate Speech requires Starfish voices — use Starfish Only when picking voice_id for TTS',
	},
	{
		displayName: 'Custom Engine',
		name: 'engineCustom',
		type: 'string',
		default: '',
		displayOptions: { show: { ...rl, operation: ['listVoices'], engineFilter: ['custom'] } },
		placeholder: 'starfish',
		description: 'Sent as the engine query parameter to GET /v3/voices',
	},
	{
		displayName: 'Language',
		name: 'voiceLanguage',
		type: 'string',
		default: '',
		displayOptions: { show: { ...rl, operation: ['listVoices'] } },
		placeholder: 'English',
	},
	{
		displayName: 'Gender',
		name: 'voiceGender',
		type: 'options',
		options: [
			{ name: 'Any', value: '' },
			{ name: 'Female', value: 'female' },
			{ name: 'Male', value: 'male' },
		],
		default: '',
		displayOptions: { show: { ...rl, operation: ['listVoices'] } },
	},
];

export const sharedListPaginationDescription: INodeProperties[] = [
	{
		displayName: 'Max Results',
		name: 'listPageLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 20,
		displayOptions: listPaginationShow,
		description:
			'Items per page (videos/voices/lipsyncs/sessions up to 100; avatar lists & styles default API max 50)',
	},
	{
		displayName: 'Pagination Token',
		name: 'listPaginationToken',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: listPaginationShow,
		description: 'Opaque cursor from next_token',
	},
];

export const videoAgentStylesFilterDescription: INodeProperties[] = [
	{
		displayName: 'Tag',
		name: 'videoAgentStylesTag',
		type: 'string',
		default: '',
		displayOptions: { show: { ...rva, operation: ['listVideoAgentStyles'] } },
		placeholder: 'cinematic',
		description: 'Optional style tag filter',
	},
];
