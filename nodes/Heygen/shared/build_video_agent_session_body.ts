import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function buildCreateVideoAgentSessionBody(
	this: IExecuteFunctions,
	i: number,
): IDataObject {
	const useJson = this.getNodeParameter('vaUseJsonBody', i, false) as boolean;
	if (useJson) {
		const raw = this.getNodeParameter('vaJsonBody', i, '{}') as string;
		let parsed: unknown;
		try {
			parsed = JSON.parse(raw);
		} catch {
			throw new NodeOperationError(this.getNode(), 'JSON Body must be valid JSON.');
		}
		if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
			throw new NodeOperationError(this.getNode(), 'JSON Body must be a JSON object.');
		}
		return parsed as IDataObject;
	}

	const prompt = this.getNodeParameter('vaPrompt', i, '') as string;
	const trimmed = prompt.trim();
	if (!trimmed.length) {
		throw new NodeOperationError(
			this.getNode(),
			'Prompt is required and must be between 1 and 10000 characters.',
		);
	}
	if (trimmed.length > 10000) {
		throw new NodeOperationError(this.getNode(), 'Prompt must be between 1 and 10000 characters.');
	}

	const body: IDataObject = { prompt: trimmed };

	const durationSec = this.getNodeParameter('vaDurationSec', i, 0) as number;
	if (durationSec > 0) {
		const d = Number(durationSec);
		if (Number.isNaN(d) || d < 5) {
			throw new NodeOperationError(this.getNode(), 'Duration must be at least 5 seconds when provided.');
		}
		body.duration_sec = d;
	}

	const orientation = this.getNodeParameter('vaOrientation', i, '') as string;
	if (orientation.trim()) {
		body.orientation = orientation.trim();
	}

	const avatarId = this.getNodeParameter('vaAvatarId', i, '') as string;
	if (avatarId.trim()) {
		body.avatar_id = avatarId.trim();
	}

	return body;
}
