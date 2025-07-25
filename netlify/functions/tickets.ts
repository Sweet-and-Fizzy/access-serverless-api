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
 * API v1.0 Ticket Creation Endpoint
 * Creates support tickets with ProForma integration
 * 
 * This is the versioned equivalent of the legacy create-support-ticket endpoint
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
 * Create support ticket with ProForma integration
 */
const createTicket = async (requestData: ApiRequest) => {
  try {
    const { serviceDeskId, requestTypeId, requestFieldValues, attachments } = requestData;

    // Determine ProForma template ID based on request type
    let templateFormId: number | undefined;
    switch (requestTypeId) {
      case 17: // General support
        templateFormId = 1;
        break;
      case 30: // ACCESS login
        templateFormId = 4;
        break;
      case 31: // Provider login
        templateFormId = 5;
        break;
    }

    // Map field values using existing field mapping logic
    const mappedFields = mapFieldValues(requestTypeId, requestFieldValues);

    // Map ProForma values using existing ProForma mapping logic
    const proformaAnswers = mapProformaValues(requestTypeId, requestFieldValues);

    // Handle file attachments
    let temporaryAttachmentIds: string[] = [];
    if (attachments && attachments.length > 0) {
      
      for (const attachment of attachments) {
        // Validate attachment fields before processing
        if (!attachment.fileName || typeof attachment.fileName !== 'string') {
          console.error('[TICKET] Invalid attachment: missing or invalid fileName', attachment);
          continue;
        }
        if (!attachment.contentType || typeof attachment.contentType !== 'string') {
          console.error('[TICKET] Invalid attachment: missing or invalid contentType', attachment);
          continue;
        }
        if (!attachment.fileData || typeof attachment.fileData !== 'string') {
          console.error('[TICKET] Invalid attachment: missing or invalid fileData', attachment);
          continue;
        }
        if (typeof attachment.size !== 'number' || attachment.size <= 0) {
          console.error('[TICKET] Invalid attachment: missing or invalid size', attachment);
          continue;
        }
        
        try {
          const uploadResult = await uploadTemporaryAttachment(serviceDeskId, attachment);
          
          // Extract the actual attachment ID from the JSM response structure
          const attachmentId = uploadResult.temporaryAttachments?.[0]?.temporaryAttachmentId;
          if (attachmentId) {
            temporaryAttachmentIds.push(attachmentId);
          }
        } catch (error) {
          console.error(`Failed to upload attachment ${attachment.fileName}:`, error);
        }
      }
      
    }

    // Build JSM request
    const jsmRequest: JsmRequest = {
      serviceDeskId,
      requestTypeId,
      requestFieldValues: {
        ...mappedFields,
        // Add attachments field if we have any temporary IDs
        ...(temporaryAttachmentIds.length > 0 && {
          attachment: temporaryAttachmentIds
        })
      },
      raiseOnBehalfOf: requestFieldValues.email, // Extract email from the original request
      ...(templateFormId && {
        form: {
          templateFormId,
          answers: proformaAnswers
        }
      })
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
    console.error('Ticket creation error:', error);
    return {
      success: false,
      statusCode: 500,
      error: 'Failed to create ticket',
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
        error: 'Method not allowed. Use POST to create tickets.',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      })
    }
  }

  try {
    const body: ApiRequest = JSON.parse(event.body || '{}')
    
    // Validate required fields for the original format
    const requiredFields = ['serviceDeskId', 'requestTypeId', 'requestFieldValues']
    const missing = requiredFields.filter(field => !body[field])
    
    // Check for required fields within requestFieldValues based on request type
    if (body.requestFieldValues) {
      let requiredFieldValues: string[] = ['email']; // email is always required
      
      // Add request-type specific required fields
      switch (body.requestTypeId) {
        case 17: // General support tickets
          requiredFieldValues.push('summary', 'description');
          break;
        case 30: // ACCESS login issues
          requiredFieldValues.push('description'); // Only description required, no summary
          break;
        case 31: // Provider login issues  
          requiredFieldValues.push('description'); // Only description required, no summary
          break;
      }
      
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

    // Process the ticket creation directly
    const result = await createTicket(body)
    
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
    console.error('API v1 ticket creation error:', error)
    
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