import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function buildCreateAvatarV3Body(this: IExecuteFunctions, i: number): IDataObject {
	const useJson = this.getNodeParameter('avatarUseJsonBody', i, false) as boolean;
	if (useJson) {
		const raw = this.getNodeParameter('avatarJsonBody', i, '{}') as string;
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

	const type = this.getNodeParameter('avatarCreateType', i, 'prompt') as string;
	const name = this.getNodeParameter('avatarName', i, '') as string;
	if (!name.trim()) {
		throw new NodeOperationError(this.getNode(), 'Name is required.');
	}

	const body: IDataObject = { type, name: name.trim() };

	if (type === 'prompt') {
		const prompt = this.getNodeParameter('avatarPrompt', i, '') as string;
		if (!prompt.trim()) {
			throw new NodeOperationError(this.getNode(), 'Prompt is required when type is Prompt.');
		}
		body.prompt = prompt.trim();
		return body;
	}

	throw new NodeOperationError(
		this.getNode(),
		'For Photo Avatar or Digital Twin you must enable Define Body Using JSON and supply image/video/consent fields per the HeyGen API.',
	);
}
