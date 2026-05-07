/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */

import type { INodeProperties } from 'n8n-workflow';

const rl = { resource: ['list'] };

export const voiceActionsDescription: INodeProperties[] = [
	{
		displayName: 'Prompt',
		name: 'voiceDesignPrompt',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: { show: { ...rl, operation: ['designVoice'] } },
		description: 'Natural language description of the voice you want',
	},
	{
		displayName: 'Seed',
		name: 'voiceDesignSeed',
		type: 'string',
		default: '',
		displayOptions: { show: { ...rl, operation: ['designVoice'] } },
		placeholder: '1',
		description: 'Optional integer for another batch of suggestions',
	},
	{
		displayName: 'Text',
		name: 'ttsText',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: { show: { ...rl, operation: ['generateSpeech'] } },
		description: 'Plain text or SSML',
	},
	{
		displayName: 'Voice ID',
		name: 'ttsVoiceId',
		type: 'string',
		default: '',
		displayOptions: { show: { ...rl, operation: ['generateSpeech'] } },
		description:
			'Starfish-compatible voice_id — use List Voices with Engine Filter = Starfish Only',
	},
];
