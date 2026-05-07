/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

const ra = { resource: ['avatar'] };

export const avatarCreateDescription: INodeProperties[] = [
	{
		displayName: 'Define Body Using JSON',
		name: 'avatarUseJsonBody',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...ra, operation: ['createAvatar'] } },
		description:
			'Whether to send JSON Body as-is for POST /v3/avatars (use for photo or digital twin with files)',
	},
	{
		displayName: 'JSON Body',
		name: 'avatarJsonBody',
		type: 'json',
		default: '{\n  "type": "prompt",\n  "name": "",\n  "prompt": ""\n}\n',
		displayOptions: { show: { ...ra, operation: ['createAvatar'], avatarUseJsonBody: [true] } },
		description: 'Raw JSON object for POST /v3/avatars',
	},
	{
		displayName: 'Type',
		name: 'avatarCreateType',
		type: 'options',
		options: [
			{ name: 'Prompt', value: 'prompt' },
			{ name: 'Photo Avatar', value: 'photo_avatar' },
			{ name: 'Digital Twin', value: 'digital_twin' },
		],
		default: 'prompt',
		displayOptions: { show: { ...ra, operation: ['createAvatar'] }, hide: { avatarUseJsonBody: [true] } },
		description:
			'Prompt builds name + prompt in-app; photo and digital twin require JSON Body with asset/video fields',
	},
	{
		displayName: 'Name',
		name: 'avatarName',
		type: 'string',
		default: '',
		displayOptions: { show: { ...ra, operation: ['createAvatar'] }, hide: { avatarUseJsonBody: [true] } },
		description: 'Display name for the new avatar',
	},
	{
		displayName: 'Prompt',
		name: 'avatarPrompt',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: {
			show: { ...ra, operation: ['createAvatar'], avatarCreateType: ['prompt'] },
			hide: { avatarUseJsonBody: [true] },
		},
		description: 'Text description when type is Prompt',
	},
];
