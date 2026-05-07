import type { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { heyGenApiRequest, heyGenApiUploadAssetV3 } from '../../shared/shared_functions';

export async function getAvatarsListApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const qs: IDataObject = {};
	const groupId = this.getNodeParameter('avatarLooksGroupId', i, '') as string;
	if (groupId.trim()) qs.group_id = groupId.trim();

	const avatarType = this.getNodeParameter('avatarLooksAvatarType', i, 'any') as string;
	if (avatarType !== 'any') qs.avatar_type = avatarType;

	const ownership = this.getNodeParameter('avatarLooksOwnership', i, 'any') as string;
	if (ownership !== 'any') qs.ownership = ownership;

	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;

	return await heyGenApiRequest.call(this, 'GET', '/avatars/looks', {}, qs, {}, 'api', 'v3');
}

export async function getAvatarsGroupsListApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const qs: IDataObject = {};
	const ownership = this.getNodeParameter('avatarGroupsOwnership', i, 'any') as string;
	if (ownership !== 'any') qs.ownership = ownership;

	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;

	return await heyGenApiRequest.call(this, 'GET', '/avatars', {}, qs, {}, 'api', 'v3');
}

export async function getVoiceListApi(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const qs: IDataObject = {};
	const voiceLibraryType = this.getNodeParameter('voiceLibraryType', i, 'public') as string;
	qs.type = voiceLibraryType;

	const engineFilter = this.getNodeParameter('engineFilter', i, 'starfish') as string;
	if (engineFilter === 'starfish') {
		qs.engine = 'starfish';
	} else if (engineFilter === 'custom') {
		const custom = this.getNodeParameter('engineCustom', i, '') as string;
		if (custom.trim()) qs.engine = custom.trim();
	}

	const language = this.getNodeParameter('voiceLanguage', i, '') as string;
	if (language) qs.language = language;

	const gender = this.getNodeParameter('voiceGender', i, '') as string;
	if (gender) qs.gender = gender;

	qs.limit = this.getNodeParameter('listPageLimit', i, 20) as number;
	const token = this.getNodeParameter('listPaginationToken', i, '') as string;
	if (token) qs.token = token;

	return await heyGenApiRequest.call(this, 'GET', '/voices', {}, qs, {}, 'api', 'v3');
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

			const buf = Buffer.from(binaryProperty.data, 'base64');
			const fileName = binaryProperty.fileName || 'upload';
			responseData = (await heyGenApiUploadAssetV3.call(
				this,
				buf,
				fileName,
				binaryProperty.mimeType || 'application/octet-stream',
			)) as IDataObject;
		} else {
			// File URL option
			const fileUrl = this.getNodeParameter('fileUrl', i) as string;

			if (!fileUrl) {
				throw new NodeOperationError(this.getNode(), 'File URL is required!');
			}

			const getRes = await this.helpers.httpRequest({
				method: 'GET',
				url: fileUrl,              // use `url` (not `uri`)
				encoding: 'arraybuffer',   // binary body
				json: false,
				returnFullResponse: true,  // get headers + body
			} as IHttpRequestOptions);

			// Normalize body to Buffer
			const fileBuffer: Buffer = Buffer.isBuffer(getRes.body)
			? getRes.body
			: Buffer.from(getRes.body as ArrayBuffer);

			// Pull Content-Type if present
			const headers = (getRes.headers ?? {}) as Record<string, string | string[]>;
			const ct = (headers['content-type'] || headers['Content-Type']) as string | undefined;
			let mimeType = ct ? ct.split(';')[0].trim() : '';

			// filename from Content-Disposition
			if (!mimeType) {
				const cd = (headers['content-disposition'] || headers['Content-Disposition']) as string | undefined;
				let filename: string | undefined;
				if (cd) {
					const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
					if (m?.[1]) filename = decodeURIComponent(m[1]);
				}

				// Fallback to URL path / extension
				const nameSource = filename ?? (() => { try { return new URL(fileUrl).pathname; } catch { return fileUrl; } })();
				const ext = (nameSource.match(/\.([A-Za-z0-9]+)$/)?.[1] || '').toLowerCase();
				const map: Record<string, string> = {
					jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
					mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', mkv: 'video/x-matroska',
					mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', ogg: 'audio/ogg',
					pdf: 'application/pdf',
				};
				mimeType = map[ext] ?? 'application/octet-stream';
			}

			const nameFromUrl = (() => {
				try {
					return new URL(fileUrl).pathname.split('/').pop() || 'upload';
				} catch {
					return 'upload';
				}
			})();
			
			responseData = (await heyGenApiUploadAssetV3.call(
				this,
				fileBuffer,
				nameFromUrl,
				mimeType,
			)) as IDataObject;
		}
		if (!responseData) {
			throw new NodeOperationError(this.getNode(), 'Upload failed, no response received.');
		}
		return responseData;
	}