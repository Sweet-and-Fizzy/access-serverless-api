# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Setup
```bash
# Install dependencies
npm install

# Install Netlify CLI globally (required for local development)
npm install -g netlify-cli

# Start local development server
netlify dev
```

### Testing the API Locally
```bash
# Health check
curl http://localhost:8888/api/v1/health

# Create a test ticket
curl -X POST http://localhost:8888/api/v1/tickets \
  -H "Content-Type: application/json" \
  -d '{"serviceDeskId": 2, "requestTypeId": 17, "requestFieldValues": {"email": "test@example.com", "summary": "Test", "description": "Test"}}'
```

### Deployment
```bash
# Deploy to production (automatic on push to main)
git push origin main
```

## Architecture Overview

This is a Netlify Functions-based serverless API that integrates with Atlassian JSM (Jira Service Management) to create support tickets for the ACCESS CI program.

### Key Design Patterns

1. **Serverless Functions**: Each endpoint is a separate TypeScript function in `/netlify/functions/`
2. **URL Rewriting**: Clean API paths (`/api/v1/tickets`) are rewritten to function paths (`/.netlify/functions/tickets`) via netlify.toml
3. **Shared Code**: Common field mappings and configurations are in `/netlify/functions/shared/`
4. **Self-Documenting**: OpenAPI spec is auto-generated and served via Swagger UI

### Request Flow

1. Client makes request to `/api/v1/tickets`
2. Netlify rewrites to `/.netlify/functions/tickets`
3. Function validates request and maps user-friendly field names to JSM field IDs
4. Function calls JSM REST API with proper authentication
5. If attachments exist, they're uploaded first and attached to the ticket
6. Response includes ticket key and portal URL

### Field Mapping System

The API abstracts JSM's complex field IDs using a mapping system in `shared/field-mapping.ts`:
- User provides readable names like `"priority": "high"`
- System maps to JSM choice IDs like `"customfield_10098": { "id": "10074" }`
- ProForma fields are mapped separately for each request type

### Service Desk Configuration

- **Service Desk 2**: General support tickets (Request Types 17, 30, 31)
- **Service Desk 3**: Security incidents (Request Type 26)

## Environment Variables

Required for production deployment:
- `JIRA_API_EMAIL`: Jira account email for API authentication
- `JIRA_API_KEY`: Jira API token (not password)
- `JSM_BASE_URL`: Base URL for Jira instance (e.g., https://yourdomain.atlassian.net)
- `JIRA_CLOUD_ID`: Cloud ID for the Jira instance

Optional:
- `NODE_ENV`: Environment name (defaults to 'development')
- `URL`: Full deployment URL (auto-set by Netlify)

## Important Considerations

1. **No Build Step**: TypeScript is compiled by Netlify at deploy time - no local build needed
2. **No Test Suite**: Currently no automated tests - test manually via curl or Swagger UI
3. **Authentication**: Uses Basic Auth with API token - never commit credentials
4. **Rate Limits**: Be mindful of Atlassian API rate limits when testing
5. **Error Handling**: All functions return standardized error responses with appropriate HTTP status codes

## ProForma Integration

Different request types use specific ProForma templates:
- Template 1: General support (RT 17)
- Template 4: ACCESS login issues (RT 30)
- Template 5: Resource login issues (RT 31)
- No template: Security incidents (RT 26)

When adding new fields, check if they're ProForma fields (need special mapping) or standard JSM fields.