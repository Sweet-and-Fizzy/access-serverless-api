import { Handler } from '@netlify/functions'
// @ts-ignore - handle node-fetch type issue
import fetch from 'node-fetch'

// Define JSM request interface with flexible field values
interface JsmRequest {
  serviceDeskId: number;
  requestTypeId: number;
  requestFieldValues: Record<string, any>;
  raiseOnBehalfOf?: string;
}

// Define the known fields for support ticket request type
const supportTicketFields = {
  summary: 'summary',
  description: 'description',
  email: 'email',
  // Add other fields that are known to work with JSM
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  // Handle OPTIONS request (preflight request)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    }
  }

  let requestBody: any = {}
  let jsmResponse = null
  let errorMessage: string | null = null

  if (event.body) {
    try {
      requestBody = JSON.parse(event.body)

      const serviceDeskId = 1     // in prod will be: 2
      const requestTypeId = 10006 // in prod will be: requestBody.requestTypeId

      // Extract the known fields from the request
      const formattedFieldValues: Record<string, any> = {}
      const userInputValues = requestBody.requestFieldValues || {}

      // Only include fields that are in our supportTicketFields list
      Object.keys(supportTicketFields).forEach(fieldKey => {
        if (userInputValues[fieldKey] !== undefined) {
          formattedFieldValues[supportTicketFields[fieldKey]] = userInputValues[fieldKey]
        }
      })

      const dataForJSM: JsmRequest = {
        serviceDeskId,
        requestTypeId,
        requestFieldValues: formattedFieldValues,
        raiseOnBehalfOf: userInputValues.email
      }

      console.log('| 🔄 data for JSM:', dataForJSM)

      // Send data to JSM
      const auth = Buffer.from(`${process.env.DEV_JIRA_API_EMAIL}:${process.env.DEV_JIRA_API_KEY}`).toString('base64')

      const response = await fetch(`${process.env.DEV_JSM_BASE_URL}/rest/servicedeskapi/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(dataForJSM)
      })

      jsmResponse = await response.json()

      if (!response.ok) {
        errorMessage = `Error from JSM: ${response.status} ${response.statusText}`
        console.error('| 😳 JSM API Error:', errorMessage, jsmResponse)
      } else {
        console.log('| ✅ JSM Response:', jsmResponse)
      }

    } catch (error) {
      console.error('| 😳 Error:', error)
      errorMessage = `Error: ${error.message}`
    }
  }

  return {
    statusCode: errorMessage ? 500 : 200,
    headers,
    body: JSON.stringify({
      message: errorMessage || 'Request created successfully',
      receivedData: requestBody,
      jsmResponse: jsmResponse
    })
  }
}
