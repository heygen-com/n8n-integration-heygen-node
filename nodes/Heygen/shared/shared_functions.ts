import {
    IExecuteFunctions,
    IExecuteSingleFunctions,
    IHookFunctions,
    ILoadOptionsFunctions,
    IHttpRequestMethods,
    IDataObject,
    NodeApiError,
    JsonObject,
    IHttpRequestOptions
} from 'n8n-workflow';


export async function heyGenApiRequest(
    this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
    options: IDataObject = {},
    baseUrl: string = 'upload',
    apiVersion: string = 'v1'
) {
    const credentials = await this.getCredentials('heyGenApi');

    const requestOptions: IHttpRequestOptions = {
        headers: {
            'X-Api-Key': credentials.apiKey as string,
        },
        method,
        qs,
        url: `https://${baseUrl}.heygen.com/${apiVersion}${endpoint}`,
        json: false, // Default to false
    };

    if (options.binary) {
        // For binary uploads, set the content-type header and raw body
        requestOptions.headers!['Content-Type'] = options.mimeType as string;
        requestOptions.body = options.binaryData;
        requestOptions.json = false; // Ensure JSON is disabled

    } else {
        // For JSON requests
        requestOptions.body = body;
        requestOptions.json = true;
    }

    try {

        const response = await this.helpers.request!(requestOptions);
        if (typeof response === 'string' && response.trim().startsWith('{')) {
            try {
                return JSON.parse(response);
            } catch (parseError) {
                return response;
            }
        }
        
        return response;
    } catch (error) {
        
        throw new NodeApiError(this.getNode(), error as JsonObject);
    }
}
