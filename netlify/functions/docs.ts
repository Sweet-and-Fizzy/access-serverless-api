import { Handler } from '@netlify/functions'

/**
 * OpenAPI 3.0 Documentation Endpoint
 * Self-documenting API specification
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

  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'ACCESS Support Ticket API',
      version: '1.0.0',
      description: 'API for creating and managing ACCESS support tickets with Atlassian JSM integration',
      contact: {
        name: 'ACCESS Support',
        url: 'https://support.access-ci.org'
      }
    },
    servers: [
      {
        url: process.env.URL || 'https://your-netlify-domain.netlify.app',
        description: 'Production server'
      }
    ],
    paths: {
      '/api/v1/health': {
        get: {
          summary: 'API Health Check',
          description: 'Returns API status and available endpoints',
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'healthy' },
                      version: { type: 'string', example: '1.0.0' },
                      timestamp: { type: 'string', format: 'date-time' },
                      endpoints: { type: 'object' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/tickets': {
        post: {
          summary: 'Create Support Ticket',
          description: 'Creates a new support ticket in Atlassian JSM with ProForma integration',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ticketType', 'summary', 'description', 'email'],
                  properties: {
                    ticketType: {
                      type: 'string',
                      enum: ['general_help', 'feedback', 'access_login', 'provider_login'],
                      description: 'Type of support ticket:\n- general_help: General support questions (RT 17)\n- feedback: User feedback (RT 17)\n- access_login: ACCESS portal login issues (RT 30)\n- provider_login: Resource provider login issues (RT 31)'
                    },
                    summary: {
                      type: 'string',
                      maxLength: 255,
                      description: 'Brief summary of the issue'
                    },
                    description: {
                      type: 'string',
                      description: 'Detailed description of the issue'
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      description: 'Reporter email address'
                    },
                    keywords: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Relevant keywords for categorization'
                    },
                    priority: {
                      type: 'string',
                      enum: ['Low', 'Medium', 'High', 'Critical'],
                      description: 'Issue priority level'
                    },
                    accessId: {
                      type: 'string',
                      description: 'ACCESS ID (required for login issues)'
                    },
                    userName: {
                      type: 'string',
                      description: 'User name (required for login issues)'
                    },
                    accessResource: {
                      type: 'string',
                      description: 'Resource name (required for provider_login tickets)'
                    },
                    identityProvider: {
                      type: 'string',
                      description: 'Identity provider (for access_login tickets)'
                    },
                    browser: {
                      type: 'string',
                      description: 'Browser information (for access_login tickets)'
                    },
                    userIdAtResource: {
                      type: 'string',
                      description: 'User ID at the resource (for provider_login tickets)'
                    },
                    hasResourceProblem: {
                      type: 'string',
                      enum: ['Yes', 'No'],
                      description: 'Whether this is a resource-specific problem'
                    },
                    resourceName: {
                      type: 'string',
                      description: 'Name of the resource experiencing issues'
                    },
                    suggestedKeyword: {
                      type: 'string',
                      description: 'Additional keyword suggestions'
                    },
                    attachments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          fileName: { type: 'string' },
                          contentType: { type: 'string' },
                          fileData: { type: 'string', format: 'base64' },
                          size: { type: 'integer' }
                        }
                      },
                      description: 'File attachments (base64 encoded)'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Ticket created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          ticketKey: { type: 'string', example: 'SUPP-123' },
                          ticketUrl: { type: 'string', format: 'uri' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid request data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string' },
                      details: { type: 'object' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      }
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(openApiSpec, null, 2)
  }
}