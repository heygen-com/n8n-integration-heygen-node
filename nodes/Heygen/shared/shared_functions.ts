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

type AuthenticationType = 'apiKey' | 'oAuth2';

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
    // Determine authentication type
    let authType: AuthenticationType = 'apiKey';
    try {
        // Try to get authentication parameter if available
        if ('getNodeParameter' in this) {
            // In ILoadOptionsFunctions, getCurrentNodeParameter is available
            if ('getCurrentNodeParameter' in this) {
                const loadOptionsThis = this as ILoadOptionsFunctions;
                authType = (loadOptionsThis.getCurrentNodeParameter('authentication') as AuthenticationType) || 'apiKey';
            } else {
                // In IExecuteFunctions context
                authType = (this as IExecuteFunctions).getNodeParameter('authentication', 0) as AuthenticationType;
            }
        }
    } catch {
        // Default to apiKey if parameter not available
        authType = 'apiKey';
    }

    const credentialType = authType === 'oAuth2' ? 'heyGenOAuth2Api' : 'heyGenApi';
    const credentials = await this.getCredentials(credentialType);

    const requestOptions: IHttpRequestOptions = {
        headers: {},
        method,
        qs,
        url: `https://${baseUrl}.heygen.com/${apiVersion}${endpoint}`,
        json: false, // Default to false
    };

    // Set authentication header based on credential type
    if (authType === 'oAuth2') {
        requestOptions.headers!['Authorization'] = `Bearer ${credentials.access_token as string}`;
    } else {
        requestOptions.headers!['X-Api-Key'] = credentials.apiKey as string;
    }

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
        const response = await this.helpers.httpRequestWithAuthentication!.call(
            this,
            credentialType,
            requestOptions,
        );
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