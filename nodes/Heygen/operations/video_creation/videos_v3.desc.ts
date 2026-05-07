/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

const rv = { resource: ['video'] };

const showListVideosOnly: INodeProperties['displayOptions'] = {
	show: { ...rv, operation: ['listVideos'] },
};
const showGetOrDelete: INodeProperties['displayOptions'] = {
	show: { ...rv, operation: ['getVideoStatus', 'deleteVideo'] },
};
const showCreate: INodeProperties['displayOptions'] = {
	show: { ...rv, operation: ['createVideo'] },
};

export const videosV3Description: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'videosFolderId',
		type: 'string',
		default: '',
		displayOptions: showListVideosOnly,
		description: 'Filter by folder ID',
	},
	{
		displayName: 'Title Filter',
		name: 'videosTitleFilter',
		type: 'string',
		default: '',
		displayOptions: showListVideosOnly,
		description: 'Filter by title substring',
	},
	{
		displayName: 'Video ID',
		name: 'videoId',
		type: 'string',
		default: '',
		displayOptions: showGetOrDelete,
		description:
			'Unique video ID (`video_id`). For Get Video: response includes status, URLs, duration, and failure info when applicable.',
	},
	{
		displayName: 'Define Body Using JSON',
		name: 'videosUseJsonBody',
		type: 'boolean',
		default: false,
		displayOptions: showCreate,
		description:
			'Whether to send JSON Body as-is to POST /v3/videos (advanced). If false, use the fields below.',
	},
	{
		displayName: 'JSON Body',
		name: 'videosJsonBody',
		type: 'json',
		default: '{\n  "type": "avatar",\n  "avatar_id": ""\n}\n',
		displayOptions: { show: { ...rv, operation: ['createVideo'], videosUseJsonBody: [true] } },
		description: 'Raw JSON object for POST /v3/videos',
	},
	{
		displayName: 'Visual Source',
		name: 'videosVisualSource',
		type: 'options',
		options: [
			{ name: 'Avatar ID', value: 'avatarId' },
			{ name: 'Image URL', value: 'imageUrl' },
			{ name: 'Image Asset ID', value: 'imageAssetId' },
		],
		default: 'avatarId',
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
		description: 'Exactly one visual source is sent (HeyGen API requirement)',
	},
	{
		displayName: 'Video Type',
		name: 'videosVideoType',
		type: 'string',
		default: 'avatar',
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
		description:
			'Request body `type` field (e.g. avatar). Avatar IV and Avatar V use this v3 endpoint; Avatar III generation is only on legacy v1/v2 APIs.',
	},
	{
		displayName: 'Avatar ID',
		name: 'videosAvatarId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVisualSource: ['avatarId'] },
			hide: { videosUseJsonBody: [true] },
		},
		description: 'Avatar look ID from List Avatars',
	},
	{
		displayName: 'Image URL',
		name: 'videosImageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVisualSource: ['imageUrl'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Image Asset ID',
		name: 'videosImageAssetId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVisualSource: ['imageAssetId'] },
			hide: { videosUseJsonBody: [true] },
		},
		description: 'From Upload Asset (POST /v3/assets)',
	},
	{
		displayName: 'Voice',
		name: 'videosVoiceMode',
		type: 'options',
		options: [
			{ name: 'Text to Speech', value: 'text' },
			{ name: 'Audio URL', value: 'audio' },
			{ name: 'None', value: 'none' },
		],
		default: 'text',
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
	},
	{
		displayName: 'Script',
		name: 'videosScript',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVoiceMode: ['text'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Voice ID',
		name: 'videosVoiceId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVoiceMode: ['text'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Voice Speed',
		name: 'videosVoiceSpeed',
		type: 'number',
		typeOptions: { minValue: 0.5, maxValue: 2, numberPrecision: 2 },
		default: 1,
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVoiceMode: ['text'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Audio URL',
		name: 'videosAudioUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosVoiceMode: ['audio'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Video Dimensions',
		name: 'videosDimension',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
		default: {},
		options: [
			{
				name: 'dimensionValues',
				displayName: 'Dimension',
				values: [
					{ displayName: 'Width', name: 'width', type: 'number', default: 1280 },
					{ displayName: 'Height', name: 'height', type: 'number', default: 720 },
				],
			},
		],
		description: 'Used to derive aspect_ratio and resolution for the API',
	},
	{
		displayName: 'Background',
		name: 'videosBackgroundType',
		type: 'options',
		options: [
			{ name: 'None', value: 'none' },
			{ name: 'Color', value: 'color' },
			{ name: 'Image', value: 'image' },
			{ name: 'Video URL as Background Art', value: 'video' },
		],
		default: 'none',
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
	},
	{
		displayName: 'Background Color',
		name: 'videosBackgroundColor',
		type: 'color',
		default: '#f6f6fc',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosBackgroundType: ['color'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Background Image URL',
		name: 'videosBackgroundImageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosBackgroundType: ['image'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Background Video URL',
		name: 'videosBackgroundVideoUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rv, operation: ['createVideo'], videosBackgroundType: ['video'] },
			hide: { videosUseJsonBody: [true] },
		},
	},
	{
		displayName: 'Caption',
		name: 'videosCaption',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
		description: 'Whether to set enable_caption on the API request',
	},
	{
		displayName: 'Additional Fields',
		name: 'videosAdditionalFields',
		type: 'collection',
		placeholder: 'Add optional field',
		default: {},
		displayOptions: { show: { ...rv, operation: ['createVideo'] }, hide: { videosUseJsonBody: [true] } },
		options: [
			{ displayName: 'Callback ID', name: 'callbackId', type: 'string', default: '' },
			{ displayName: 'Callback URL', name: 'callbackUrl', type: 'string', default: '' },
			{ displayName: 'Folder ID', name: 'folderId', type: 'string', default: '' },
			{ displayName: 'Test', name: 'test', type: 'boolean', default: false },
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
		],
	},
];
