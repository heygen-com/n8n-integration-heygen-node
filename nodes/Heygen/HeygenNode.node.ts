import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionTypes } from 'n8n-workflow';

// operations
import { heygenResource, heygenOperations } from './operations/operations_list';
import { operationSpecificFields } from './operations';

// api
import {
	createAvatarVideoApi,
	createTemplateVideoApi,
	createVideoAgentApi,
	translateVideoApi,
	getVideoStatusApi,
} from './operations/video_creation/api_requests';
import {
	getAvatarsListApi,
	getAvatarsGroupsListApi,
	getVoiceListApi,
	uploadFileApi,
} from './operations/common_operations/api_requests';
import {
	registerOAuthClientApi,
} from './operations/oauth/api_requests';

// load options
import { getTemplatesList } from './methods/getLists';

export class HeygenNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HeyGen',
		name: 'heygenNode',
		icon: 'file:heygen.svg',
		group: ['ai', 'contentCreation'] as unknown as INodeTypeDescription['group'],
		version: 1,
		description: 'HeyGen community node',
		defaults: {
			name: 'HeyGen',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,

		// credential setup
		credentials: [
			{
				name: 'heyGenApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
					hide: {
						resource: ['oauth'],
						operation: ['registerOAuthClient'],
					},
				},
			},
			{
				name: 'heyGenOAuth2Api',
				required: false,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
					hide: {
						resource: ['oauth'],
						operation: ['registerOAuthClient'],
					},
				},
			},
		],

		properties: [
			// authentication selector
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				displayOptions: {
					hide: {
						resource: ['oauth'],
						operation: ['registerOAuthClient'],
					},
				},
				options: [
					{
						name: 'OAuth2 (Recommended)',
						value: 'oAuth2',
						description: 'Connect with your HeyGen account using OAuth2',
					},
					{
						name: 'API Key (Legacy)',
						value: 'apiKey',
						description: 'Legacy method - API keys have higher rate limits and costs',
					},
				],
				default: 'oAuth2',
				description:
					'Authentication method to use. OAuth2 is recommended for better rates and lower costs.',
			},

			// Resource selector
			heygenResource,

			// operations list
			...heygenOperations,

			...operationSpecificFields,
		],
	};

	methods = {
		loadOptions: {
			getTemplatesList,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				switch (operation) {
					case 'createAvatarVideo': {
						const response = await createAvatarVideoApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'createTemplateVideo': {
						const response = await createTemplateVideoApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'getVideoStatus': {
						const response = await getVideoStatusApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'createVideoAgent': {
						const response = await createVideoAgentApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'translateVideo': {
						const response = await translateVideoApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'listAvatars': {
						const response = await getAvatarsListApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'listAvatarsGroups': {
						const response = await getAvatarsGroupsListApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'listVoices': {
						const response = await getVoiceListApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'uploadAssets': {
						const response = await uploadFileApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					case 'registerOAuthClient': {
						const response = await registerOAuthClientApi.call(this, i);
						returnData.push({ json: response, pairedItem: { item: i } });
						break;
					}
					default:
						break;
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
