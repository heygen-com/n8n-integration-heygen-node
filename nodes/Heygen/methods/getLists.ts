import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { heyGenApiRequest } from '../shared/shared_functions';
import { HEYGEN_TEMPLATE_LIST_AND_GENERATE_API_VERSION } from '../shared/heygen_template_api_version';

type TemplateRow = { template_id?: string; name?: string; aspect_ratio?: string };

function formatTemplatesListError(err: unknown): string {
	if (typeof err === 'string' && err.length > 0) {
		return err;
	}
	if (err && typeof err === 'object' && 'message' in err) {
		const m = (err as { message?: string }).message;
		if (typeof m === 'string' && m.length > 0) {
			return m;
		}
	}
	return JSON.stringify(err);
}

function extractTemplatesFromListResponse(response: {
	error?: unknown;
	data?: unknown;
}): TemplateRow[] {
	if (response?.error) {
		throw new Error(`HeyGen templates request failed: ${formatTemplatesListError(response.error)}`);
	}
	const data = response?.data;
	if (Array.isArray(data)) {
		return data as TemplateRow[];
	}
	if (data && typeof data === 'object' && Array.isArray((data as { templates?: unknown }).templates)) {
		return (data as { templates: TemplateRow[] }).templates;
	}
	throw new Error('Invalid template response: expected data array or data.templates');
}

export async function getTemplatesList(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await heyGenApiRequest.call(
		this,
		'GET',
		'/templates',
		{},
		{},
		{},
		'api',
		HEYGEN_TEMPLATE_LIST_AND_GENERATE_API_VERSION,
	);

	const templates = extractTemplatesFromListResponse(response as { error?: unknown; data?: unknown });

	const baseLabel = (template: TemplateRow, id: string) => {
		const baseName = template.name || id;
		const ratio = template.aspect_ratio ? ` (${template.aspect_ratio})` : '';
		return `${baseName}${ratio}`;
	};

	const bases = templates.map((t) => {
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

	return templates.map((template, i) => {
		const id = template.template_id as string;
		const base = bases[i];
		const duplicate = (baseCounts.get(base) ?? 0) > 1;
		const name = duplicate ? `${base} — ${id.slice(0, 8)}…` : base;
		return { name, value: id };
	});
}
