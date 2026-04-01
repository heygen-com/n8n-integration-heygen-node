import { describe, it, expect } from 'vitest';
import { buildTemplateVariablesFromRows } from './template_variables';

describe('buildTemplateVariablesFromRows', () => {
	it('maps text variables', () => {
		const out = buildTemplateVariablesFromRows([
			{ key: 'HEADLINE', type: 'text', textContent: 'Hello from the API' },
		]);
		expect(out.HEADLINE).toEqual({
			name: 'HEADLINE',
			type: 'text',
			properties: { content: 'Hello from the API' },
		});
	});

	it('maps image variables', () => {
		const out = buildTemplateVariablesFromRows([
			{
				key: 'HERO_IMAGE',
				type: 'image',
				imageAssetId: 'asset-1',
				imageFit: 'contain',
			},
		]);
		expect(out.HERO_IMAGE).toEqual({
			name: 'HERO_IMAGE',
			type: 'image',
			properties: { asset_id: 'asset-1', fit: 'contain' },
		});
	});

	it('defaults image fit to cover', () => {
		const out = buildTemplateVariablesFromRows([
			{ key: 'IMG', type: 'image', imageAssetId: 'a' },
		]);
		expect((out.IMG.properties as { fit: string }).fit).toBe('cover');
	});

	it('maps video variables including volume', () => {
		const out = buildTemplateVariablesFromRows([
			{
				key: 'BG_CLIP',
				type: 'video',
				videoUrl: 'https://cdn.example.com/bg.mp4',
				videoPlayStyle: 'loop',
				videoFit: 'contain',
				videoVolume: 0.5,
			},
		]);
		expect(out.BG_CLIP?.properties).toEqual({
			url: 'https://cdn.example.com/bg.mp4',
			play_style: 'loop',
			fit: 'contain',
			volume: 0.5,
		});
	});

	it('maps character variables', () => {
		const out = buildTemplateVariablesFromRows([
			{
				key: 'PRESENTER',
				type: 'character',
				characterKind: 'avatar',
				characterId: 'char-99',
			},
		]);
		expect(out.PRESENTER?.properties).toEqual({
			type: 'avatar',
			character_id: 'char-99',
		});
	});

	it('maps audio variables', () => {
		const out = buildTemplateVariablesFromRows([
			{ key: 'VO_TRACK', type: 'audio', audioAssetId: 'aud-1' },
		]);
		expect(out.VO_TRACK?.properties).toEqual({ asset_id: 'aud-1' });
	});

	it('maps voice with optional locale', () => {
		const withLocale = buildTemplateVariablesFromRows([
			{
				key: 'NARRATOR_VOICE',
				type: 'voice',
				voiceId: 'v1',
				voiceLocale: 'en-US',
			},
		]);
		expect(withLocale.NARRATOR_VOICE?.properties).toEqual({
			voice_id: 'v1',
			locale: 'en-US',
		});

		const noLocale = buildTemplateVariablesFromRows([
			{ key: 'V', type: 'voice', voiceId: 'v2', voiceLocale: '' },
		]);
		expect(noLocale.V?.properties).toEqual({ voice_id: 'v2' });
	});

	it('skips rows without key or type', () => {
		expect(buildTemplateVariablesFromRows([{ type: 'text', textContent: 'x' }])).toEqual({});
		expect(buildTemplateVariablesFromRows([{ key: 'K', textContent: 'x' }])).toEqual({});
	});

	it('supports multiple slots', () => {
		const out = buildTemplateVariablesFromRows([
			{ key: 'A', type: 'text', textContent: 't' },
			{ key: 'B', type: 'audio', audioAssetId: 'aid' },
		]);
		expect(Object.keys(out).sort()).toEqual(['A', 'B']);
	});
});
