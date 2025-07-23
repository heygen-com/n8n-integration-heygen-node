import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest } from '../../shared/shared_functions'; 



export async function getAvatarsListApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	return await heyGenApiRequest.call(this,'GET','/avatars',{},{},{},'api','v2');

}


export async function getAvatarsGroupsListApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	const includePublic = this.getNodeParameter('includePublic', i) as string;

	return await heyGenApiRequest.call(
                            this,
                            'GET',
                            '/avatar_group.list',
                            {},
                            {include_public: includePublic},
                            {},
                            'api',
                            'v2'
                        );

}


export async function getVoiceListApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

	return await heyGenApiRequest.call(
                            this,
                            'GET',
                            '/voices',
                            {},
                            {},
                            {},
                            'api',
                            'v2'
                        );

}




export async function uploadFileApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {

		const items = this.getInputData();
		
		const binaryData = this.getNodeParameter('binaryData', i) as boolean;
		let responseData: IDataObject | null = null;


		if (binaryData) {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

			if (items[i].binary === undefined) {
				throw new NodeOperationError(this.getNode(), 'No binary data exists on item!');
			}

			const binaryProperty = items[i].binary![binaryPropertyName];

			if (binaryProperty === undefined) {
				throw new NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" exists on item!`);
			}

			// For direct binary upload, send the binary data with the proper Content-Type
			responseData = await heyGenApiRequest.call(
				this,
				'POST',
				'/asset',
				{},
				{},
				{
					binary: true,
					binaryData: Buffer.from(binaryProperty.data, 'base64'),
					mimeType: binaryProperty.mimeType,
				}
			);
		} else {
			// File URL option
			const fileUrl = this.getNodeParameter('fileUrl', i) as string;

			if (!fileUrl) {
				throw new NodeOperationError(this.getNode(), 'File URL is required!');
			}

			// For URL-based uploads, we'll need to fetch the file first and then upload it
			const fileResponse = await this.helpers.request({
				method: 'GET',
				uri: fileUrl,
				encoding: null, // Return body as Buffer
			});

			// Determine MIME type from URL (simple approach)
			let mimeType = 'application/octet-stream';
			if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg')) {
				mimeType = 'image/jpeg';
			} else if (fileUrl.endsWith('.png')) {
				mimeType = 'image/png';
			} else if (fileUrl.endsWith('.mp4')) {
				mimeType = 'video/mp4';
			} else if (fileUrl.endsWith('.webm')) {
				mimeType = 'video/webm';
			} else if (fileUrl.endsWith('.mp3')) {
				mimeType = 'audio/mpeg';
			}

			// Upload the file using binary mode
			responseData = await heyGenApiRequest.call(
				this,
				'POST',
				'/asset',
				{},
				{},
				{
					binary: true,
					binaryData: fileResponse,
					mimeType: mimeType,
				}
			);
		}
		if (!responseData) {
			throw new NodeOperationError(this.getNode(), 'Upload failed, no response received.');
		}
		return responseData;
	}