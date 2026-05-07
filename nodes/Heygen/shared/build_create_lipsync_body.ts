import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function buildCreateLipsyncBody(this: IExecuteFunctions, i: number): IDataObject {
	const useJson = this.getNodeParameter('lsUseJsonBody', i, false) as boolean;
	if (useJson) {
		const raw = this.getNodeParameter('lsJsonBody', i, '{}') as string;
		try {
			return JSON.parse(raw) as IDataObject;
		} catch {
			throw new NodeOperationError(this.getNode(), 'Lipsync JSON body must be valid JSON', {
				itemIndex: i,
			});
		}
	}

	const videoUrl = (this.getNodeParameter('lsVideoUrl', i, '') as string).trim();
	const audioUrl = (this.getNodeParameter('lsAudioUrl', i, '') as string).trim();
	if (!videoUrl || !audioUrl) {
		throw new NodeOperationError(
			this.getNode(),
			'Video URL and Audio URL are required when not using JSON body',
			{ itemIndex: i },
		);
	}

	const body: IDataObject = {
		video: { type: 'url', url: videoUrl },
		audio: { type: 'url', url: audioUrl },
	};

	const mode = (this.getNodeParameter('lsMode', i, '') as string).trim();
	if (mode) body.mode = mode;

	return body;
}
