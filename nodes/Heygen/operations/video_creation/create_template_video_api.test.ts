import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IExecuteFunctions, INode } from 'n8n-workflow';

vi.mock('../../shared/shared_functions', () => ({
	heyGenApiRequest: vi.fn().mockResolvedValue({ data: { video_id: 'mock-video-id' } }),
}));

import { createTemplateVideoApi } from './api_requests';
import { heyGenApiRequest } from '../../shared/shared_functions';

function getByPath(obj: Record<string, unknown>, path: string): unknown {
	const parts = path.split('.');
	let cur: unknown = obj;
	for (const p of parts) {
		if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
		cur = (cur as Record<string, unknown>)[p];
	}
	return cur;
}

function createMockExecuteFunctions(parameters: Record<string, unknown>): IExecuteFunctions {
	return {
		getNode: () => ({ name: 'HeyGen', type: 'heygenNode' }) as INode,
		getNodeParameter: (name: string, _itemIndex: number, defaultValue?: unknown) => {
			const v = getByPath(parameters, name);
			return v !== undefined ? v : defaultValue;
		},
	} as unknown as IExecuteFunctions;
}

describe('createTemplateVideoApi', () => {
	beforeEach(() => {
		vi.mocked(heyGenApiRequest).mockClear();
		vi.mocked(heyGenApiRequest).mockResolvedValue({ data: { video_id: 'mock-video-id' } });
	});

	it('POSTs expected path and body for template generate', async () => {
		const mockExec = createMockExecuteFunctions({
			caption: false,
			additionalFields: {
				test: false,
				title: 'My generated video',
				callbackId: 'order-12345',
				callbackUrl: 'https://example.com/webhooks/heygen',
			},
			enableSharing: false,
			dimension: { dimensionValues: { width: 1920, height: 1080 } },
			templateIDString: 'tpl-abc',
			templateIDOptions: '',
			templateVariables: {
				variable: [
					{
						key: 'HEADLINE',
						type: 'text',
						textContent: 'Hello',
					},
				],
			},
		});

		await createTemplateVideoApi.call(mockExec, 0);

		expect(heyGenApiRequest).toHaveBeenCalledTimes(1);
		const args = vi.mocked(heyGenApiRequest).mock.calls[0];
		expect(args[0]).toBe('POST');
		expect(args[1]).toBe('/template/tpl-abc/generate');
		expect(args[2]).toMatchObject({
			caption: false,
			test: false,
			title: 'My generated video',
			callback_id: 'order-12345',
			callback_url: 'https://example.com/webhooks/heygen',
			enable_sharing: false,
			dimension: { width: 1920, height: 1080 },
			variables: {
				HEADLINE: {
					name: 'HEADLINE',
					type: 'text',
					properties: { content: 'Hello' },
				},
			},
		});
		expect(args[3]).toEqual({});
		expect(args[4]).toEqual({});
		expect(args[5]).toBe('api');
		expect(args[6]).toBe('v2');
	});

	it('resolves template id from templateIDOptions when string is empty', async () => {
		const mockExec = createMockExecuteFunctions({
			caption: true,
			additionalFields: { test: false },
			enableSharing: true,
			dimension: { dimensionValues: { width: 1280, height: 720 } },
			templateIDString: '',
			templateIDOptions: 'tpl-from-list',
			templateVariables: { variable: [] },
		});

		await createTemplateVideoApi.call(mockExec, 0);

		expect(vi.mocked(heyGenApiRequest).mock.calls[0][1]).toBe('/template/tpl-from-list/generate');
	});
});
