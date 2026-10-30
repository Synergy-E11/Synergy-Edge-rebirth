# Synergy Edge Tech — AI Command Centre

A separate, local-first prototype for coordinating seven AI work roles without changing the existing public website.

## Open
Open `index.html` in a modern browser, or publish this folder as a separate static site. No build step is required.

## Current capabilities
- Seven AI department directory with role descriptions.
- Task creation, priority and workflow selection.
- Task status tracking and notes.
- Copy-ready prompts for each department.
- Browser-local persistence via localStorage.
- JSON workspace export.
- Responsive dashboard layout.

## Important current limitation
This is a manual-handoff prototype, not an automated multi-agent integration. It does not call provider APIs, send prompts to external services, authenticate accounts, or store API credentials. The provider status labels are intentionally set to NOT CONNECTED.

## Recommended production architecture
1. Frontend: retain this dashboard or migrate it into a maintained React/Next.js application.
2. Backend: authenticated API service with role-based access control.
3. Orchestration: durable task queue and workflow state machine.
4. Provider adapters: separate server-side adapters for each provider, using official APIs and current model availability.
5. Secrets: server-side secret manager/environment variables only; never browser localStorage or client bundles.
6. Storage: database for projects, tasks, outputs, audit events and provider usage.
7. Observability: request IDs, token/cost tracking, retries, timeouts and error logs.
8. Human approval: explicit review before code changes, external messages, production deployment or other consequential actions.

## Integration sequence
- Phase 1: validate dashboard and task workflow.
- Phase 2: choose providers/models and obtain API access separately.
- Phase 3: implement one server-side provider adapter at a time.
- Phase 4: add orchestration, retries, budgets and audit logging.
- Phase 5: add review gates, tests and deployment pipeline.

## Security and change control
- Do not commit API keys, tokens, passwords, private customer data or credentials.
- Do not modify the existing Synergy Edge Tech website as part of this prototype.
- Keep production deployment separate and require owner approval.
- Review generated code and dependencies before merging.

## Brand direction
Dark premium interface, gold accent (#D4AF37), warm off-white text (#F8F7F3), black base (#0B0B0B), Roboto typography and concise interface copy.
