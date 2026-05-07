import type { IExecuteFunctions } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions';

export async function designVoiceApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const prompt = this.getNodeParameter('voiceDesignPrompt', i, '') as string;
	if (!prompt?.trim()) {
		throw new NodeOperationError(this.getNode(), 'Prompt is required.');
	}

	const body: IDataObject = { prompt: prompt.trim() };

	const seedRaw = this.getNodeParameter('voiceDesignSeed', i, '') as string;
	if (seedRaw.trim() !== '') {
		const n = Number(seedRaw.trim());
		if (!Number.isNaN(n)) {
			body.seed = n;
		}
	}

	return (await heyGenApiRequest.call(this, 'POST', '/voices', body, {}, {}, 'api', 'v3')) as IDataObject;
}

export async function generateSpeechApi(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const text = this.getNodeParameter('ttsText', i, '') as string;
	const voiceId = this.getNodeParameter('ttsVoiceId', i, '') as string;

	if (!text?.trim()) {
		throw new NodeOperationError(this.getNode(), 'Text is required.');
	}
	if (!voiceId?.trim()) {
		throw new NodeOperationError(this.getNode(), 'Voice ID is required.');
	}

	const body: IDataObject = {
		text: text.trim(),
		voice_id: voiceId.trim(),
	};

	return (await heyGenApiRequest.call(
		this,
		'POST',
		'/voices/speech',
		body,
		{},
		{},
		'api',
		'v3',
	)) as IDataObject;
}
