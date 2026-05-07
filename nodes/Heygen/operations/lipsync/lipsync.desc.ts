/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

const rls = { resource: ['lipsync'] };

export const lipsyncDescription: INodeProperties[] = [
	{
		displayName: 'Lipsync ID',
		name: 'lsLipsyncId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...rls,
				operation: ['getLipsync', 'deleteLipsync', 'updateLipsync'],
			},
		},
		description: 'Unique lipsync job identifier',
	},
	{
		displayName: 'Define Body Using JSON',
		name: 'lsUseJsonBody',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...rls, operation: ['createLipsync'] } },
		description: 'Whether to send a raw JSON body for POST /v3/lipsyncs',
	},
	{
		displayName: 'JSON Body',
		name: 'lsJsonBody',
		type: 'json',
		default:
			'{\n  "video": { "type": "url", "url": "https://example.com/video.mp4" },\n  "audio": { "type": "url", "url": "https://example.com/audio.mp3" }\n}\n',
		displayOptions: {
			show: { ...rls, operation: ['createLipsync'], lsUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Video URL',
		name: 'lsVideoUrl',
		type: 'string',
		default: '',
		placeholder: 'https://cdn.example.com/video.mp4',
		displayOptions: {
			show: { ...rls, operation: ['createLipsync'] },
			hide: { lsUseJsonBody: [true] },
		},
		description: 'Source video URL (sent as video.type URL)',
	},
	{
		displayName: 'Audio URL',
		name: 'lsAudioUrl',
		type: 'string',
		default: '',
		placeholder: 'https://cdn.example.com/audio.mp3',
		displayOptions: {
			show: { ...rls, operation: ['createLipsync'] },
			hide: { lsUseJsonBody: [true] },
		},
		description: 'Replacement audio URL (sent as audio.type URL)',
	},
	{
		displayName: 'Mode',
		name: 'lsMode',
		type: 'options',
		options: [
			{ name: 'Default (Omit)', value: '' },
			{ name: 'Speed', value: 'speed' },
			{ name: 'Precision', value: 'precision' },
		],
		default: '',
		displayOptions: {
			show: { ...rls, operation: ['createLipsync'] },
			hide: { lsUseJsonBody: [true] },
		},
		description: 'Processing mode: faster output vs higher-quality lip-sync',
	},
	{
		displayName: 'Title',
		name: 'lsTitle',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...rls, operation: ['updateLipsync'] } },
		description: 'Display title for the lipsync job',
	},
];
