#!/usr/bin/env bash
# Quieter local n8n when telemetry/feature-flag hosts are unreachable (e.g. broken IPv6, firewall).
# Same-network workaround used together with official isolation vars:
# https://docs.n8n.io/hosting/environment-variables/configuration-examples/isolation/
#
# Usage: ./scripts/n8n-start-local.sh
#    or:  ./scripts/n8n-start-local.sh start

set -euo pipefail

export N8N_DIAGNOSTICS_ENABLED=false
export N8N_VERSION_NOTIFICATIONS_ENABLED=false
export N8N_TEMPLATES_ENABLED=false
export EXTERNAL_FRONTEND_HOOKS_URLS=
export N8N_DIAGNOSTICS_CONFIG_FRONTEND=
export N8N_DIAGNOSTICS_CONFIG_BACKEND=

# Prefer IPv4 when IPv6 routes refuse connections (common source of ECONNREFUSED on 2600:… addresses).
export NODE_OPTIONS="--dns-result-order=ipv4first${NODE_OPTIONS:+ ${NODE_OPTIONS}}"

if command -v n8n >/dev/null 2>&1; then
	if [[ $# -eq 0 ]]; then
		exec n8n start
	fi
	exec n8n "$@"
else
	echo "error: n8n not found in PATH (install globally or use: npx n8n)" >&2
	exit 1
fi
