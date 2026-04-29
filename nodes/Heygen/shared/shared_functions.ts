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

/** Must match the node parameter default in HeygenNode (OAuth2 is recommended). */
const DEFAULT_AUTHENTICATION: AuthenticationType = 'oAuth2';

function resolveAuthenticationType(
    this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
): AuthenticationType {
    try {
        if ('getCurrentNodeParameter' in this) {
            const load = this as ILoadOptionsFunctions;
            const fromCurrent = load.getCurrentNodeParameter('authentication') as AuthenticationType | undefined;
            if (fromCurrent === 'apiKey' || fromCurrent === 'oAuth2') {
                return fromCurrent;
            }
            const fromNode = load.getNodeParameter('authentication', DEFAULT_AUTHENTICATION) as AuthenticationType;
            if (fromNode === 'apiKey' || fromNode === 'oAuth2') {
                return fromNode;
            }
            return DEFAULT_AUTHENTICATION;
        }
        // Per-item execution (item index 0) — not the same overload as load-options getNodeParameter.
        if ('getInputData' in this) {
            const exec = this as IExecuteFunctions;
            const v = exec.getNodeParameter('authentication', 0, DEFAULT_AUTHENTICATION) as AuthenticationType;
            if (v === 'apiKey' || v === 'oAuth2') {
                return v;
            }
            return DEFAULT_AUTHENTICATION;
        }
        if ('getNodeParameter' in this) {
            const v = (this as IHookFunctions).getNodeParameter(
                'authentication',
                DEFAULT_AUTHENTICATION,
            ) as AuthenticationType;
            if (v === 'apiKey' || v === 'oAuth2') {
                return v;
            }
            return DEFAULT_AUTHENTICATION;
        }
    } catch {
        // fall through
    }
    return DEFAULT_AUTHENTICATION;
}

function getOAuth2AccessToken(credentials: IDataObject): string {
    const direct = credentials.access_token;
    if (typeof direct === 'string' && direct.length > 0) {
        return direct;
    }
    const nested = credentials.oauthTokenData as IDataObject | undefined;
    const fromNested = nested?.access_token;
    if (typeof fromNested === 'string' && fromNested.length > 0) {
        return fromNested;
    }
    throw new Error(
        'HeyGen OAuth2 access token is missing. Open the credential and reconnect, or switch to API key auth.',
    );
}

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
    const authType = resolveAuthenticationType.call(this);

    const credentialType = authType === 'oAuth2' ? 'heyGenOAuth2Api' : 'heyGenApi';

    const requestOptions: IHttpRequestOptions = {
        headers: {},
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
        const credentials = (await this.getCredentials(credentialType)) as IDataObject;

        // Set authentication header based on credential type
        if (authType === 'oAuth2') {
            requestOptions.headers!['Authorization'] = `Bearer ${getOAuth2AccessToken(credentials)}`;
        } else {
            requestOptions.headers!['X-Api-Key'] = credentials.apiKey as string;
        }

        // Plain httpRequest: auth headers are set above. Defaults must stay aligned with the node's
        // Authentication default (OAuth2) so loadOptions requests the same credential type as execute.
        const response = await this.helpers.httpRequest(requestOptions);
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