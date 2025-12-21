import type {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { handleHeygenWebhookEvent } from './operations/webhooks/webhook';

export class HeygenTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HeyGen Trigger',
		name: 'heygenTrigger',
		icon: 'file:heygen.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts a workflow when HeyGen sends a webhook event',
		defaults: { name: 'HeyGen Trigger' },

		inputs: [],
		outputs: [NodeConnectionType.Main],

		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'heygen',
				isFullPath: false,
			},
		],

		properties: [],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		if (typeof body?.event !== 'string') {
			throw new NodeOperationError(this.getNode(), 'Missing or invalid "event" field in webhook payload.');
		}

		const event = body.event as string;
		const message = handleHeygenWebhookEvent(event);

		return {
			workflowData: [[{ json: { event, message, payload: body } }]],
		};
	}
}
