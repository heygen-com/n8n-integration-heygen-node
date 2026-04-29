/**
 * HeyGen template list + generate are still on the v2 HTTP paths.
 * @see https://developers.heygen.com/endpoint-version-comparison (Template API — “Not yet available” on v3)
 * Retrieve template metadata uses GET /v3/template/{id} (separate from list/generate).
 */
export const HEYGEN_TEMPLATE_LIST_AND_GENERATE_API_VERSION = 'v2' as const;
