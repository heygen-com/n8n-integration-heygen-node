/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

const rva = { resource: ['videoAgent'] };

export const videoAgentDescription: INodeProperties[] = [
	{
		displayName: 'Define Body Using JSON',
		name: 'vaUseJsonBody',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...rva, operation: ['createVideoAgentSession'] } },
		description:
			'Whether to send JSON Body as-is for POST /v3/video-agents (chat mode, extra fields, etc.)',
	},
	{
		displayName: 'JSON Body',
		name: 'vaJsonBody',
		type: 'json',
		default:
			'{\n  "prompt": "A friendly 20-second vertical ad for a reusable water bottle."\n}\n',
		displayOptions: {
			show: { ...rva, operation: ['createVideoAgentSession'], vaUseJsonBody: [true] },
		},
		description: 'Raw JSON object for POST /v3/video-agents',
	},
	{
		displayName: 'Prompt',
		name: 'vaPrompt',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: {
			show: { ...rva, operation: ['createVideoAgentSession'] },
			hide: { vaUseJsonBody: [true] },
		},
		description: 'What the Video Agent should produce (1–10000 characters)',
	},
	{
		displayName: 'Duration (Seconds)',
		name: 'vaDurationSec',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		displayOptions: {
			show: { ...rva, operation: ['createVideoAgentSession'] },
			hide: { vaUseJsonBody: [true] },
		},
		description: 'Optional target duration; use 0 to omit (otherwise minimum 5 seconds)',
	},
	{
		displayName: 'Orientation',
		name: 'vaOrientation',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rva, operation: ['createVideoAgentSession'] },
			hide: { vaUseJsonBody: [true] },
		},
		description: 'Optional orientation hint',
	},
	{
		displayName: 'Avatar ID',
		name: 'vaAvatarId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...rva, operation: ['createVideoAgentSession'] },
			hide: { vaUseJsonBody: [true] },
		},
		description: 'Optional avatar look ID to constrain the agent',
	},
];
