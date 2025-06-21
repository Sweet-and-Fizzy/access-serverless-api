import { Handler } from '@netlify/functions'

/**
 * API Health Check Endpoint
 * Returns API version, status, and available endpoints
 */
export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const apiInfo = {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        tickets: {
          path: '/api/v1/tickets',
          methods: ['POST'],
          description: 'Create support tickets with ProForma integration'
        },
        'security-incidents': {
          path: '/api/v1/security-incidents',
          methods: ['POST'],
          description: 'Create security incident reports for cybersecurity team'
        },
        health: {
          path: '/api/v1/health',
          methods: ['GET'],
          description: 'API health check and discovery'
        },
        docs: {
          path: '/api/v1/docs',
          methods: ['GET'],
          description: 'OpenAPI documentation'
        }
      },
      links: {
        documentation: '/api/v1/docs',
        health: '/api/v1/health'
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(apiInfo, null, 2)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  }
}