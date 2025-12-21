import type { INodeProperties } from 'n8n-workflow';

export const getAvatarsList: INodeProperties[] = [
	// omit fields
];

export const uploadAssets: INodeProperties[] = [
	{
		displayName: 'Binary Data',
		name: 'binaryData',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['uploadAssets'],
			},
		},
		description: 'Whether if the data to upload should be taken from binary field',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['uploadAssets'],
				binaryData: [true],
			},
		},
		description: 'Object property name which holds binary data',
	},
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['uploadAssets'],
				binaryData: [false],
			},
		},
		description: 'URL of the file to upload',
	}
];



export const getVoicesList: INodeProperties[] = [
	// omit fields
];


