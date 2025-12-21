// Import operations
//import { videoCreationOperations } from './video_creation/';
//import { photoAvatarOperations } from './photo_avatars';

// Import parameter descriptions
import {
	createAvatarVideoDescription, 
	createTemplateVideoDescription,
	getVideoStatus
 } from './video_creation';
 import {
	getAvatarsList,
	getAvatarsGroupsList,
	getVoicesList
 } from './common_operations/get_lists.desc'
  import {
	uploadAssets
 } from './common_operations/upload_assets.desc'
//import { generatePhotoDescription, checkStatusDescription } from './photo_avatars';


export const operationSpecificFields = [
	// video operations
	...createAvatarVideoDescription,
	...createTemplateVideoDescription,
	...getVideoStatus,

	//common operations
	...getAvatarsList,
	...getAvatarsGroupsList,
	...getVoicesList,
	...uploadAssets,
	//...checkStatusDescription,
];
