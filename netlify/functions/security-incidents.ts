import { Handler } from '@netlify/functions'
// @ts-ignore - handle node-fetch type issue
import fetch from 'node-fetch'
import FormData from 'form-data'
import { mapFieldValues, mapProformaValues } from './shared/field-mapping'

/**
 * Interface for Atlassian JSM Service Desk API request structure
 */
interface JsmRequest {
  serviceDeskId: number;
  requestTypeId: number;
  requestFieldValues: Record<string, any>;
  raiseOnBehalfOf?: string;
  temporaryAttachmentIds?: string[];
  form?: {
    templateFormId?: number;
    answers: Record<string, any>;
  };
}

/**
 * API v1.0 Security Incident Creation Endpoint
 * Creates security incident tickets in the security service desk
 * 
 * Uses serviceDeskId: 3 and requestTypeId: 26 for security incidents
 */

interface ApiRequest {
  serviceDeskId: number;
  requestTypeId: number;
  requestFieldValues: Record<string, any>;
  attachments?: Array<{
    fileName: string;
    contentType: string;
    fileData: string;
    size: number;
  }>;
}

interface ApiResponse {
  success: boolean;
  data?: {
    ticketKey: string;
    ticketUrl: string;
  };
  error?: string;
  details?: any;
  version: string;
  timestamp: string;
}

/**
 * Upload file as temporary attachment to JSM
 */
const uploadTemporaryAttachment = async (serviceDeskId: number, attachment: {
  fileName: string;
  contentType: string;
  fileData: string;
  size: number;
}) => {
  try {
    const { fileName, contentType, fileData, size } = attachment;
    const form = new FormData();
    const fileBuffer = Buffer.from(fileData, 'base64');
    
    form.append('file', fileBuffer, {
      filename: fileName,
      contentType: contentType,
      knownLength: size
    });

    const auth = Buffer.from(`${process.env.JIRA_API_EMAIL}:${process.env.JIRA_API_KEY}`).toString('base64');

    const response = await fetch(`${process.env.JSM_BASE_URL}/rest/servicedeskapi/servicedesk/${serviceDeskId}/attachTemporaryFile`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'X-Atlassian-Token': 'no-check',
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JSM attachment upload failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading temporary attachment:', error);
    throw error;
  }
};

/**
 * Create security incident ticket
 */
const createSecurityIncident = async (requestData: ApiRequest) => {
  try {
    const { serviceDeskId, requestTypeId, requestFieldValues, attachments } = requestData;

    // Security incidents don't use ProForma (as mentioned earlier: "no proforma (whew)")
    // So we don't need templateFormId logic

    // Map field values using existing field mapping logic
    const mappedFields = mapFieldValues(requestTypeId, requestFieldValues);

    // Handle file attachments
    let temporaryAttachmentIds: string[] = [];
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        try {
          const uploadResult = await uploadTemporaryAttachment(serviceDeskId, attachment);
          temporaryAttachmentIds.push(uploadResult.temporaryAttachmentId);
        } catch (error) {
          console.error(`Failed to upload attachment ${attachment.fileName}:`, error);
        }
      }
    }

    // Build JSM request for security incident
    const jsmRequest: JsmRequest = {
      serviceDeskId,
      requestTypeId,
      requestFieldValues: mappedFields,
      raiseOnBehalfOf: requestFieldValues.email, // Extract email from the original request
      ...(temporaryAttachmentIds.length > 0 && { temporaryAttachmentIds })
      // No form/ProForma for security incidents
    };

    // Submit to JSM
    const auth = Buffer.from(`${process.env.JIRA_API_EMAIL}:${process.env.JIRA_API_KEY}`).toString('base64');
    
    const response = await fetch(`${process.env.JSM_BASE_URL}/rest/servicedeskapi/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(jsmRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JSM API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      statusCode: 200,
      data: {
        ticketKey: result.issueKey,
        ticketUrl: `${process.env.JSM_BASE_URL}/servicedesk/customer/portal/${serviceDeskId}/${result.issueKey}`
      }
    };

  } catch (error) {
    console.error('Security incident creation error:', error);
    return {
      success: false,
      statusCode: 500,
      error: 'Failed to create security incident',
      details: { message: error.message }
    };
  }
};

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST to create security incidents.',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      })
    }
  }

  try {
    const body: ApiRequest = JSON.parse(event.body || '{}')
    
    // Validate required fields
    const requiredFields = ['serviceDeskId', 'requestTypeId', 'requestFieldValues']
    const missing = requiredFields.filter(field => !body[field])
    
    // Check for required fields within requestFieldValues for security incidents
    if (body.requestFieldValues) {
      // Security incidents require: summary, priority, description, name, email, accessId
      const requiredFieldValues = ['summary', 'priority', 'description', 'name', 'email', 'accessId'];
      
      const missingFieldValues = requiredFieldValues.filter(field => !body.requestFieldValues[field])
      missing.push(...missingFieldValues.map(field => `requestFieldValues.${field}`))
    }
    
    if (missing.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
          details: { missingFields: missing },
          version: '1.0.0',
          timestamp: new Date().toISOString()
        })
      }
    }

    // Validate that we're using the correct service desk and request type for security
    if (body.serviceDeskId !== 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid service desk ID. Security incidents must use serviceDeskId: 3',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        })
      }
    }

    if (body.requestTypeId !== 26) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid request type ID. Security incidents must use requestTypeId: 26',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        })
      }
    }

    // Process the security incident creation
    const result = await createSecurityIncident(body)
    
    const apiResponse: ApiResponse = {
      success: result.success,
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }

    if (result.success) {
      apiResponse.data = result.data
    } else {
      apiResponse.error = result.error
      apiResponse.details = result.details
    }

    return {
      statusCode: result.statusCode,
      headers,
      body: JSON.stringify(apiResponse, null, 2)
    }

  } catch (error) {
    console.error('API v1 security incident creation error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      })
    }
  }
}