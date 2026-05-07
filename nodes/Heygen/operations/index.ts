import {
	createAvatarVideoDescription,
	createTemplateVideoDescription,
	getVideoStatus,
	translateVideoDescription,
	videosV3Description,
} from './video_creation';
import {
	getAvatarsList,
	getAvatarsGroupsList,
	getVoicesList,
	sharedListPaginationDescription,
	videoAgentStylesFilterDescription,
} from './common_operations/get_lists.desc';
import { voiceActionsDescription } from './voice/voice_actions.desc';
import { avatarCreateDescription } from './avatar/avatar_create.desc';
import { videoAgentDescription } from './video_agent/video_agent.desc';
import { lipsyncDescription } from './lipsync/lipsync.desc';
import { uploadAssets } from './common_operations/upload_assets.desc';
import { registerOAuthClientDescription } from './oauth';

export const operationSpecificFields = [
	...createAvatarVideoDescription,
	...createTemplateVideoDescription,
	...translateVideoDescription,
	...getVideoStatus,
	...videosV3Description,

	...sharedListPaginationDescription,
	...getAvatarsList,
	...getAvatarsGroupsList,
	...getVoicesList,
	...videoAgentStylesFilterDescription,
	...voiceActionsDescription,

	...avatarCreateDescription,
	...videoAgentDescription,

	...lipsyncDescription,

	...uploadAssets,
	...registerOAuthClientDescription,
];
