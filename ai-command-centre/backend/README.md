# AI Command Centre backend starter

This is a minimal Node.js 20.6+ backend foundation. It deliberately does **not** call any AI provider yet.

## Run locally
1. Install Node.js 20.6 or newer.
2. Copy `.env.example` to `.env`.
3. Set `APP_ORIGIN` to the exact origin serving the dashboard. For example, when using VS Code Live Server this may be `http://127.0.0.1:5500`.
4. Add provider API keys to the local `.env` file only when ready.
5. Run `npm start` from this folder.

The service binds to `127.0.0.1` by default. Do not expose it publicly without authentication, HTTPS, rate limiting, request validation, logging controls and deployment hardening.

## Routes
- `GET /api/health` — service health.
- `GET /api/providers` — provider directory and boolean key-presence status.

The providers endpoint never returns secrets. `connection: not-tested` means the key has not been validated with the provider.

## Provider credentials
The environment variable names are placeholders for server-side credentials. Obtain credentials only from each provider's official developer console and review its current API terms, pricing, model availability and regional access before enabling it.

## Not implemented yet
- No provider API requests.
- No automatic agent-to-agent handoffs.
- No database or user authentication.
- No task queue, usage billing or token accounting.
- No public deployment configuration.

Do not describe a provider as connected merely because an API key is present. A real connection test and successful authenticated API request are required.
