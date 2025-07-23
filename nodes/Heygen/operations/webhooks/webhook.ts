// ./operations/webhooks.webhook.ts

export function handleHeygenWebhookEvent(event: string): string {
	// can handle specific operation cases here
	// currently just message placeholders
	switch (event) {
		case 'avatar_video.success':
			return 'Avatar video created successfully.';
		case 'avatar_video.fail':
			return 'Avatar video creation failed.';
		case 'avatar_video_gif.success':
			return 'GIF avatar video created.';
		case 'avatar_video_gif.fail':
			return 'GIF avatar video failed.';
		case 'video_translate.success':
			return 'Video translation successful.';
		case 'video_translate.fail':
			return 'Video translation failed.';
		case 'personalized_video':
			return 'Personalized video received.';
		case 'instant_avatar.success':
			return 'Instant avatar created successfully.';
		case 'instant_avatar.fail':
			return 'Instant avatar creation failed.';
		case 'photo_avatar_generation.success':
			return 'Photo avatar generated successfully.';
		case 'photo_avatar_generation.fail':
			return 'Photo avatar generation failed.';
		case 'photo_avatar_train.success':
			return 'Photo avatar trained successfully.';
		case 'photo_avatar_train.fail':
			return 'Photo avatar training failed.';
		case 'photo_avatar_add_motion.success':
			return 'Photo avatar motion added.';
		case 'photo_avatar_add_motion.fail':
			return 'Photo avatar motion addition failed.';
		default:
			return `Unhandled event: ${event}`;
	}
}
