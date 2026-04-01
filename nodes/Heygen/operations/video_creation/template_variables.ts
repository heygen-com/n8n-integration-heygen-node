import type { IDataObject } from 'n8n-workflow';

/**
 * Maps n8n fixedCollection rows to HeyGen template `variables` payload.
 * Pure function — safe to unit test without n8n runtime.
 */
export function buildTemplateVariablesFromRows(
	rows: IDataObject[],
): Record<string, IDataObject> {
	const variables: Record<string, IDataObject> = {};

	for (const v of rows) {
		const key = v.key as string;
		const type = v.type as string;

		if (!key || !type) continue;

		const variable: IDataObject = {
			name: key,
			type,
			properties: {},
		};

		if (type === 'text') {
			variable.properties = { content: v.textContent || '' };
		} else if (type === 'image') {
			variable.properties = {
				asset_id: v.imageAssetId || '',
				fit: v.imageFit || 'cover',
			};
		} else if (type === 'video') {
			const vol = v.videoVolume;
			const volume =
				typeof vol === 'number' && !Number.isNaN(vol) ? vol : Number(vol) || 1;
			variable.properties = {
				url: v.videoUrl || '',
				play_style: v.videoPlayStyle || 'loop',
				fit: v.videoFit || 'contain',
				volume,
			};
		} else if (type === 'character') {
			variable.properties = {
				type: v.characterKind || 'avatar',
				character_id: v.characterId || '',
			};
		} else if (type === 'audio') {
			variable.properties = { asset_id: v.audioAssetId || '' };
		} else if (type === 'voice') {
			const props: IDataObject = { voice_id: v.voiceId || '' };
			const locale = v.voiceLocale as string | undefined;
			if (locale) {
				props.locale = locale;
			}
			variable.properties = props;
		}

		variables[key] = variable;
	}

	return variables;
}
