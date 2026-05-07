import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { IDataObject, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { heygenResource, heygenOperations } from './operations/operations_list';
import { operationSpecificFields } from './operations';

import {
	createAvatarVideoApi,
	createTemplateVideoApi,
	createVideoV3Api,
	deleteVideoApi,
	getVideoStatusApi,
	listVideosApi,
	translateVideoApi,
} from './operations/video_creation/api_requests';
import {
	getAvatarsListApi,
	getAvatarsGroupsListApi,
	getVoiceListApi,
	uploadFileApi,
} from './operations/common_operations/api_requests';
import { registerOAuthClientApi } from './operations/oauth/api_requests';
import { designVoiceApi, generateSpeechApi } from './operations/voice/api_requests';
import { createAvatarApi } from './operations/avatar/api_requests';
import {
	createVideoAgentSessionApi,
	listVideoAgentSessionsApi,
	listVideoAgentStylesApi,
} from './operations/video_agent/api_requests';
import {
	createLipsyncApi,
	deleteLipsyncApi,
	getLipsyncApi,
	listLipsyncsApi,
	updateLipsyncApi,
} from './operations/lipsync/api_requests';

import { getTemplatesList } from './methods/getLists';

export class HeygenNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HeyGen',
		name: 'heygenNode',
		icon: 'file:heygen.svg',
		group: ['ai', 'contentCreation'] as unknown as INodeTypeDescription['group'],
		version: 1,
		description: 'HeyGen community node — videos, voices, avatars, video agent, lipsync, assets',
		defaults: {
			name: 'HeyGen',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,

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

			heygenResource,

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

				let response: unknown;
				switch (operation) {
					case 'createAvatarVideo':
						response = await createAvatarVideoApi.call(this, i);
						break;
					case 'createTemplateVideo':
						response = await createTemplateVideoApi.call(this, i);
						break;
					case 'createVideo':
						response = await createVideoV3Api.call(this, i);
						break;
					case 'listVideos':
						response = await listVideosApi.call(this, i);
						break;
					case 'deleteVideo':
						response = await deleteVideoApi.call(this, i);
						break;
					case 'getVideoStatus':
						response = await getVideoStatusApi.call(this, i);
						break;
					case 'translateVideo':
						response = await translateVideoApi.call(this, i);
						break;
					case 'listAvatars':
						response = await getAvatarsListApi.call(this, i);
						break;
					case 'listAvatarsGroups':
						response = await getAvatarsGroupsListApi.call(this, i);
						break;
					case 'listVoices':
						response = await getVoiceListApi.call(this, i);
						break;
					case 'designVoice':
						response = await designVoiceApi.call(this, i);
						break;
					case 'generateSpeech':
						response = await generateSpeechApi.call(this, i);
						break;
					case 'createAvatar':
						response = await createAvatarApi.call(this, i);
						break;
					case 'listVideoAgentSessions':
						response = await listVideoAgentSessionsApi.call(this, i);
						break;
					case 'createVideoAgentSession':
						response = await createVideoAgentSessionApi.call(this, i);
						break;
					case 'listVideoAgentStyles':
						response = await listVideoAgentStylesApi.call(this, i);
						break;
					case 'uploadAssets':
						response = await uploadFileApi.call(this, i);
						break;
					case 'registerOAuthClient':
						response = await registerOAuthClientApi.call(this, i);
						break;
					case 'listLipsyncs':
						response = await listLipsyncsApi.call(this, i);
						break;
					case 'createLipsync':
						response = await createLipsyncApi.call(this, i);
						break;
					case 'getLipsync':
						response = await getLipsyncApi.call(this, i);
						break;
					case 'deleteLipsync':
						response = await deleteLipsyncApi.call(this, i);
						break;
					case 'updateLipsync':
						response = await updateLipsyncApi.call(this, i);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unsupported operation: ${operation}`,
						);
				}

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
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
