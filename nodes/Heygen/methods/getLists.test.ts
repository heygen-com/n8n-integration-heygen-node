import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ILoadOptionsFunctions } from 'n8n-workflow';

vi.mock('../shared/shared_functions', () => ({
	heyGenApiRequest: vi.fn(),
}));

import { getTemplatesList } from './getLists';
import { heyGenApiRequest } from '../shared/shared_functions';

const mockLoadOptions = {
	getCurrentNodeParameter: vi.fn().mockReturnValue('apiKey'),
	getCredentials: vi.fn().mockResolvedValue({ apiKey: 'test-key' }),
} as unknown as ILoadOptionsFunctions;

describe('getTemplatesList', () => {
	beforeEach(() => {
		vi.mocked(heyGenApiRequest).mockReset();
	});

	it('maps GET /v2/templates data.templates to dropdown options', async () => {
		vi.mocked(heyGenApiRequest).mockResolvedValue({
			error: null,
			data: {
				templates: [
					{
						template_id: 'a1b2c3d4e5f6789012345678901234ab',
						name: 'My product video',
						thumbnail_image_url: 'https://example.com/thumb.jpg',
						aspect_ratio: 'landscape',
					},
					{
						template_id: 'b2c3d4e5f6789012345678901234abcd',
						name: 'Vertical promo',
						thumbnail_image_url: null,
						aspect_ratio: 'portrait',
					},
				],
			},
		});

		const options = await getTemplatesList.call(mockLoadOptions);

		expect(heyGenApiRequest).toHaveBeenCalledWith(
			'GET',
			'/templates',
			{},
			{},
			{},
			'api',
			'v2',
		);
		expect(options).toEqual([
			{ name: 'My product video (landscape)', value: 'a1b2c3d4e5f6789012345678901234ab' },
			{ name: 'Vertical promo (portrait)', value: 'b2c3d4e5f6789012345678901234abcd' },
		]);
	});

	it('disambiguates duplicate name+aspect labels with template id prefix', async () => {
		vi.mocked(heyGenApiRequest).mockResolvedValue({
			data: {
				templates: [
					{ template_id: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', name: 'Same', aspect_ratio: 'landscape' },
					{ template_id: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', name: 'Same', aspect_ratio: 'landscape' },
				],
			},
		});

		const options = await getTemplatesList.call(mockLoadOptions);

		expect(options[0].name).toBe('Same (landscape) — aaaaaaaa…');
		expect(options[1].name).toBe('Same (landscape) — bbbbbbbb…');
		expect(options[0].value).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		expect(options[1].value).toBe('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
	});

	it('throws when top-level error is set', async () => {
		vi.mocked(heyGenApiRequest).mockResolvedValue({
			error: 'rate limited',
			data: {},
		});

		await expect(getTemplatesList.call(mockLoadOptions)).rejects.toThrow('rate limited');
	});

	it('throws when code is present and not 100', async () => {
		vi.mocked(heyGenApiRequest).mockResolvedValue({
			code: 401,
			msg: 'Unauthorized',
			data: {},
		});

		await expect(getTemplatesList.call(mockLoadOptions)).rejects.toThrow('Unauthorized');
	});

	it('accepts code 100 with templates', async () => {
		vi.mocked(heyGenApiRequest).mockResolvedValue({
			code: 100,
			data: { templates: [{ template_id: 'x', name: 'T' }] },
		});

		const options = await getTemplatesList.call(mockLoadOptions);
		expect(options).toEqual([{ name: 'T', value: 'x' }]);
	});
});
