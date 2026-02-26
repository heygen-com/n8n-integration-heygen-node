import type { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';

export async function registerOAuthClientApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const body: IDataObject = {};

	const requestOptions: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api2.heygen.com/v1/oauth/register',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body,
		json: true,
	};

	const response = await this.helpers.httpRequest(requestOptions);

	return {
		...response,
		_client_id: response.client_id,
		message: `OAuth client registered successfully. Copy the client_id: ${response.client_id}`,
	};
}
