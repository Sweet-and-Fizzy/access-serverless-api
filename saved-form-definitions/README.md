# JSM Form Definitions Reference

This directory contains saved JSM form definitions for the ACCESS Service Desk request types. These are used as reference documentation for field mappings and ProForma integration.

## Request Types

- **Request Type 17**: General Support Tickets (`support-17.json`)
- **Request Type 30**: ACCESS Portal Login Issues (`access-login-30.json`) 
- **Request Type 31**: Resource Provider Login Issues (`provider-login-31.json`)

## Usage

The field mappings in `field-mapping.ts` are derived from these definitions. The JSON files contain:

- JSM custom field IDs and names
- ProForma question IDs and types
- Choice mappings for dropdowns and multi-select fields
- Field validation requirements

## Live API Endpoints

Current form definitions can be retrieved from:

```
GET /rest/servicedeskapi/servicedesk/2/requesttype/17/field
GET /rest/servicedeskapi/servicedesk/2/requesttype/30/field  
GET /rest/servicedeskapi/servicedesk/2/requesttype/31/field
```

## Maintenance

These saved definitions should be updated periodically if the JSM form structure changes. The field mappings may need corresponding updates to maintain compatibility.