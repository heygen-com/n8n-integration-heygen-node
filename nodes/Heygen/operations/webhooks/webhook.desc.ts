import type { INodeProperties } from 'n8n-workflow';

export const webhookProperties: INodeProperties[] = [
	
	{
		displayName: 'Webhook Info',
		name: 'webhookInfo',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['webhook'],
			},
		},
		default: '',
		description: 'This operation will handle callbacks from HeyGen. You must register webhook URL in HeyGen as: https://&lt;your-workspace-ID&gt;.n8n.cloud/webhook/heygen.',
	},
];
