import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { heyGenApiRequest } from '../shared/shared_functions';

type TemplatesListResponse = {
	error?: unknown;
	code?: number;
	msg?: string | null;
	message?: string | null;
	data?: { templates?: unknown };
};

/** GET https://api.heygen.com/v2/templates — populates the Create Template Video template dropdown. */
export async function getTemplatesList(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await heyGenApiRequest.call(
		this,
		'GET',
		'/templates',
		{},
		{},
		{},
		'api',
		'v2',
	)) as TemplatesListResponse;

	if (response?.error) {
		const err = response.error;
		const msg = typeof err === 'string' ? err : JSON.stringify(err);
		throw new Error(`HeyGen templates request failed: ${msg}`);
	}

	if (response?.code !== undefined && response.code !== null && response.code !== 100) {
		const detail = response.msg ?? response.message ?? String(response.code);
		throw new Error(`HeyGen templates request failed: ${detail}`);
	}

	const templates = response?.data?.templates;
	if (!Array.isArray(templates)) {
		throw new Error('Invalid template response: expected data.templates array');
	}

	type TemplateRow = { template_id?: string; name?: string; aspect_ratio?: string };
	const rows = templates as TemplateRow[];

	const baseLabel = (template: TemplateRow, id: string) => {
		const baseName = template.name || id;
		const ratio = template.aspect_ratio ? ` (${template.aspect_ratio})` : '';
		return `${baseName}${ratio}`;
	};

	const bases = rows.map((t) => {
		const id = t.template_id;
		if (!id) {
			throw new Error('Invalid template entry: missing template_id');
		}
		return baseLabel(t, id);
	});
	const baseCounts = new Map<string, number>();
	for (const b of bases) {
		baseCounts.set(b, (baseCounts.get(b) ?? 0) + 1);
	}

	return rows.map((template, i) => {
		const id = template.template_id as string;
		const base = bases[i];
		const duplicate = (baseCounts.get(base) ?? 0) > 1;
		const name = duplicate ? `${base} — ${id.slice(0, 8)}…` : base;
		return { name, value: id };
	});
}
