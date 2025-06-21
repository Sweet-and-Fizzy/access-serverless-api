# ACCESS Serverless API

A Netlify Functions-based API for creating support tickets in Atlassian JSM Service Desk. Specifically designed to integrate with the ACCESS CI QA Bot and support ACCESS portal workflows.

## Features

- **Unified Ticket Creation**: Single endpoint supporting multiple request types
- **ProForma Integration**: Enhanced data collection through Atlassian ProForma forms
- **File Attachments**: Support for file uploads with tickets
- **Reporter Assignment**: Automatically sets ticket reporter via `raiseOnBehalfOf`
- **Multiple Request Types**:
  - **Type 17**: General support tickets
  - **Type 30**: ACCESS portal login issues
  - **Type 31**: Resource provider login issues
  - **Type 26**: Security incident reports

## 🚀 Quick Start

### API Documentation
- **📖 Interactive Docs**: `/docs` - Swagger UI with live API testing
- **🔍 API Discovery**: `/api/v1/health` - Service discovery and health check
- **📋 OpenAPI Spec**: `/api/v1/docs` - Machine-readable API specification

### Current Version: v1.0.0

## API Endpoints

### 🟢 Health Check
**GET** `/api/v1/health`

Returns API status, version, and available endpoints for service discovery.

### 📋 Create Support Ticket (Versioned)
**POST** `/api/v1/tickets`

Creates a new support ticket in JSM with ProForma integration and file attachments.

### 🔒 Create Security Incident Report
**POST** `/api/v1/security-incidents`

Creates a new security incident report in the dedicated ACCESS cybersecurity service desk (Service Desk ID: 3).

#### Security Incident Request Body

```json
{
  "serviceDeskId": 3,
  "requestTypeId": 26,
  "requestFieldValues": {
    "summary": "Suspicious network activity detected",
    "priority": "High",
    "description": "Multiple failed SSH attempts from unknown IP addresses",
    "name": "Jane Security",
    "email": "jane.security@example.edu", 
    "accessId": "ACCESS789012"
  },
  "attachments": [
    {
      "fileName": "network_logs.txt",
      "contentType": "text/plain",
      "fileData": "base64EncodedContent",
      "size": 2048
    }
  ]
}
```

#### Support Ticket Request Body

```json
{
  "serviceDeskId": 2,
  "requestTypeId": 17,
  "requestFieldValues": {
    "email": "user@example.edu",
    "summary": "Unable to access Expanse cluster",
    "description": "Getting authentication errors when trying to SSH",
    "userName": "John Doe",
    "accessId": "ACCESS123456",
    "priority": "medium",
    "issueType": "user support question",
    
    // ProForma fields (optional)
    "hasResourceProblem": "Yes",
    "userIdAtResource": "johndoe_expanse",
    "resourceName": "Expanse",
    "keywords": "SSH,Authentication"
  },
  "attachments": [
    {
      "fileName": "error_log.txt",
      "contentType": "text/plain",
      "fileData": "base64EncodedContent",
      "size": 1024
    }
  ]
}
```

#### Response

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticketKey": "ACCESS-12345",
    "ticketUrl": "https://access-ci.atlassian.net/servicedesk/customer/portal/1/ACCESS-12345"
  }
}
```

## Supported Fields by Request Type

### Request Type 17: General Support
- `summary`, `description`, `priority`
- `userName`, `accessId`, `issueType`
- **ProForma**: `hasResourceProblem`, `userIdAtResource`, `resourceName`, `keywords`, `suggestedKeyword`

### Request Type 30: ACCESS Portal Login
- `userName`, `accessId`, `description`
- **ProForma**: `identityProvider`, `browser`

### Request Type 31: Resource Provider Login
- `userName`, `accessId`, `accessResource`, `description`
- **ProForma**: `userIdAtResource`

### Request Type 26: Security Incidents
- `summary`, `description`, `priority`
- `name`, `email`, `accessId`
- **File Attachments**: Supports evidence files, logs, screenshots
- **Service Desk**: Dedicated cybersecurity team routing (Service Desk ID: 3)

## Environment Variables

Configure these environment variables in Netlify:

```bash
JIRA_API_EMAIL=your-jira-email@domain.com
JIRA_API_KEY=your-api-key
JSM_BASE_URL=https://your-instance.atlassian.net
JIRA_CLOUD_ID=your-cloud-id
```

## Development

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Start local development server:
   ```bash
   netlify dev
   ```

4. Test the API:
   ```bash
   curl -X POST http://localhost:8888/.netlify/functions/api/v1/tickets \
     -H "Content-Type: application/json" \
     -d '{"ticketType": "general_help", "summary": "Test ticket", "description": "Test description", "email": "test@example.com"}'
   ```

### Project Structure

```
├── netlify/
│   └── functions/
│       ├── health.ts                       # Health check endpoint
│       ├── docs.ts                         # OpenAPI documentation  
│       ├── tickets.ts                      # Main ticket creation API
│       ├── security-incidents.ts           # Security incident reporting API
│       └── shared/
│           └── field-mapping.ts            # Field mappings & choice IDs
├── public/
│   └── api-docs.html                       # Interactive API documentation
├── docs/
│   └── API-VERSIONING.md                   # API versioning strategy
├── saved-form-definitions/                 # ProForma reference docs
├── package.json
├── netlify.toml
└── README.md
```

## ProForma Integration

This API integrates with Atlassian ProForma forms to collect enhanced data beyond standard JSM fields. Each request type uses a specific ProForma template:

- **Template 1**: General support tickets (RT 17)
- **Template 4**: ACCESS login issues (RT 30)  
- **Template 5**: Resource login issues (RT 31)
- **Security Incidents (RT 26)**: Uses standard JSM fields only (no ProForma)

The field mappings handle conversion between user-friendly field names and the specific choice IDs required by JSM.

## Deployment

The API automatically deploys to Netlify when changes are pushed to the main branch:

```bash
git push origin main
```

**Production URL**: https://access-serverless-api.netlify.app

## Integration

This API is designed to work with:
- **ACCESS CI QA Bot**: React-based chatbot interface
- **ACCESS Portal**: User support workflows
- **Atlassian JSM**: Service desk ticket management

For chatbot integration examples, see the qa-bot repository.

## License

This project is developed for the ACCESS CI program.