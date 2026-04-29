
import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HeyGenApi implements ICredentialType {
	name = 'heyGenApi';
	displayName = 'HeyGen API';
	documentationUrl = 'https://docs.heygen.com/docs/quick-start';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.heygen.com',
			url: '/v3/users/me',
			method: 'GET',
		},
	};
}
