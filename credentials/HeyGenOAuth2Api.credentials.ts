import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class HeyGenOAuth2Api implements ICredentialType {
	name = 'heyGenOAuth2Api';
	displayName = 'HeyGen OAuth2 API';
	extends = ['oAuth2Api'];
	documentationUrl = 'https://docs.heygen.com/docs/heygen-oauth';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://app.heygen.com/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api2.heygen.com/v1/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}

