import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { heyGenApiRequest } from '../shared/shared_functions';

export async function getTemplatesList(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await heyGenApiRequest.call(this, 'GET', '/templates', {}, {}, {}, 'api', 'v2');

	if (!response?.data?.templates || !Array.isArray(response.data.templates)) {
		throw new Error('Invalid template response format');
	}

	return response.data.templates.map((template: any) => ({
		name: template.name || template.template_id,
		value: template.template_id,
	}));
}
