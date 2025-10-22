import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions, 
	IWebhookResponseData
} from 'n8n-workflow';

import { NodeConnectionType, NodeOperationError
} from 'n8n-workflow';

//operations
import { heygenOperations } from './operations/operations_list'
import { operationSpecificFields } from './operations';

//api
import { createAvatarVideoApi, createTemplateVideoApi, getVideoStatusApi } from './operations/video_creation/api_requests';
import { getAvatarsListApi, getAvatarsGroupsListApi, getVoiceListApi, uploadFileApi } from './operations/common_operations/api_requests'

//webhooks
import { handleHeygenWebhookEvent } from './operations/webhooks/webhook';

//load options
import { getTemplatesList } from './methods/getLists'; //we get options what are loaded from api

export class HeygenNode implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'HeyGen Official Node',
		name: 'heygenNode',
		icon: 'file:heygen.svg',
        group: ['ai', 'contentCreation'],
		version: 1,
		description: 'HeyGen community node',
		defaults: {
			name: 'HeyGen community node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
			name: 'heyGenApi',
			required: true,
			},
		],
		properties: [
			heygenOperations,
			...operationSpecificFields,
		],
	};

	methods = {
		loadOptions: {
			getTemplatesList,
		}
	};

	webhooks = [
		{
			name: 'heygenWebhook',
			httpMethod: 'POST',
			responseMode: 'onReceived',
			path: 'heygen', // "/webhook/heygen" in cloud: "https://your-workspace-id.n8n.cloud/webhook/heygen"
		},
	];

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		if (typeof body?.event !== 'string') {
			
			throw new NodeOperationError(this.getNode(), 'Missing or invalid "event" field in webhook payload.');
			
		}

		const event: string = body.event;
		const message = handleHeygenWebhookEvent(event);

		return {
			workflowData: [
				[
					{
						json: {
							event,
							message,
							payload: body,
						},
					},
				],
			],
		};
	}


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				// video creation operations

				if (operation === 'createAvatarVideo') {
					const response = await createAvatarVideoApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

				if (operation === 'createTemplateVideo') {
					const response = await createTemplateVideoApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

				if (operation === 'getVideoStatus') {
					const response = await getVideoStatusApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

				// common operations

				if (operation === 'listAvatars') {
					const response = await getAvatarsListApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

				if (operation === 'listAvatarsGroups') {
					const response = await getAvatarsGroupsListApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

				if (operation === 'listVoices') {
					const response = await getVoiceListApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}


				if (operation === 'uploadAssets') {
					const response = await uploadFileApi.call(this, i);
					returnData.push({ json: response, pairedItem: { item: i } });
				}

			} catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw error;
            }
        
		}

		return [returnData];
	}

}
