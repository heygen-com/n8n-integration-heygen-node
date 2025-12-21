import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

// operations
import { heygenResource, heygenOperations } from './operations/operations_list';
import { operationSpecificFields } from './operations';

// api
import {
	createAvatarVideoApi,
	createTemplateVideoApi,
	getVideoStatusApi,
} from './operations/video_creation/api_requests';
import {
	getAvatarsListApi,
	getAvatarsGroupsListApi,
	getVoiceListApi,
	uploadFileApi,
} from './operations/common_operations/api_requests';

// load options
import { getTemplatesList } from './methods/getLists';

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

		// credential setup
		credentials: [
			{
				name: 'heyGenApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
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
				},
			},
		],

		properties: [
			// authentication selector
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
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
