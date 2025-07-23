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
          description: 'Creates a new support ticket in Atlassian JSM with ProForma integration. Supports multiple ticket types with different field requirements.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      title: 'General Support Ticket (RT 17)',
                      type: 'object',
                      required: ['ticketType', 'summary', 'description', 'email', 'name', 'accessId', 'priority'],
                      properties: {
                        ticketType: {
                          type: 'string',
                          enum: ['general_help', 'support'],
                          description: 'General support questions and issues'
                        },
                        summary: {
                          type: 'string',
                          maxLength: 255,
                          description: 'Brief summary of the issue',
                          example: '[TEST DATA] Unable to access Expanse cluster'
                        },
                        description: {
                          type: 'string',
                          description: 'Detailed description of the issue',
                          example: '[TEST DATA] Getting authentication errors when trying to SSH - This is sample test data for API documentation'
                        },
                        email: {
                          type: 'string',
                          format: 'email',
                          description: 'Reporter email address',
                          example: 'test-user@example.edu'
                        },
                        name: {
                          type: 'string',
                          description: 'User full name',
                          example: 'Test User - API Documentation'
                        },
                        accessId: {
                          type: 'string',
                          description: 'ACCESS ID',
                          example: 'TEST123456'
                        },
                        priority: {
                          type: 'string',
                          enum: ['lowest', 'low', 'medium', 'high', 'highest'],
                          description: 'Issue priority level'
                        },
                        issueType: {
                          type: 'string',
                          enum: [
                            'User Account Question',
                            'Allocation Question',
                            'User Support Question',
                            'CSSN/CCEP Question',
                            'Training Question',
                            'Metrics Question',
                            'OnDemand Question',
                            'Pegasus Question',
                            'XDMoD Question',
                            'Some Other Question'
                          ],
                          description: 'Category of the support issue'
                        },
                        hasResourceProblem: {
                          type: 'string',
                          enum: ['Yes', 'No'],
                          description: 'Whether this involves an ACCESS resource'
                        },
                        resourceName: {
                          type: 'string',
                          enum: [
                            'ACES', 'Anvil', 'Bridges-2', 'DARWIN', 'Delta', 'DeltaAI',
                            'Derecho', 'Expanse', 'FASTER', 'Granite', 'Jetstream2',
                            'KyRIC', 'Launch', 'Neocortex', 'Ookami', 'Open Science Grid',
                            'Open Storage Network', 'Ranch', 'Stampede3'
                          ],
                          description: 'ACCESS resource involved (if hasResourceProblem is Yes)'
                        },
                        userIdAtResource: {
                          type: 'string',
                          description: 'User ID at the specified resource',
                          example: 'testuser_expanse'
                        },
                        keywords: {
                          type: 'array',
                          items: { type: 'string' },
                          maxItems: 5,
                          description: 'Up to 5 relevant keywords for categorization',
                          example: ['SSH', 'Authentication', 'Login']
                        },
                        suggestedKeyword: {
                          type: 'string',
                          description: 'Additional keyword if none from the list match'
                        },
                        attachments: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['fileName', 'contentType', 'fileData', 'size'],
                            properties: {
                              fileName: { type: 'string', example: 'test_error_log.txt' },
                              contentType: { type: 'string', example: 'text/plain' },
                              fileData: { type: 'string', format: 'base64' },
                              size: { type: 'integer', example: 1024 }
                            }
                          }
                        }
                      }
                    },
                    {
                      title: 'ACCESS Portal Login Issue (RT 30)',
                      type: 'object',
                      required: ['ticketType', 'name', 'accessId', 'description'],
                      properties: {
                        ticketType: {
                          type: 'string',
                          enum: ['access_login', 'loginAccess'],
                          description: 'ACCESS portal login problems'
                        },
                        name: {
                          type: 'string',
                          description: 'User full name',
                          example: 'Test User Jane - API Documentation'
                        },
                        accessId: {
                          type: 'string',
                          description: 'ACCESS ID',
                          example: 'TEST654321'
                        },
                        description: {
                          type: 'string',
                          description: 'Description of the login issue',
                          example: '[TEST DATA] Cannot log in to ACCESS portal with institutional credentials - This is sample test data for API documentation'
                        },
                        identityProvider: {
                          type: 'string',
                          enum: ['ACCESS', 'GitHub', 'Google', 'Institution', 'Microsoft', 'ORCID', 'Other'],
                          description: 'Identity provider being used'
                        },
                        browser: {
                          type: 'array',
                          items: {
                            type: 'string',
                            enum: ['Chrome', 'Firefox', 'Edge', 'Safari', 'Other']
                          },
                          description: 'Browser(s) where issue occurs'
                        },
                        attachments: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['fileName', 'contentType', 'fileData', 'size'],
                            properties: {
                              fileName: { type: 'string' },
                              contentType: { type: 'string' },
                              fileData: { type: 'string', format: 'base64' },
                              size: { type: 'integer' }
                            }
                          }
                        }
                      }
                    },
                    {
                      title: 'Resource Provider Login Issue (RT 31)',
                      type: 'object',
                      required: ['ticketType', 'name', 'accessId', 'accessResource', 'description'],
                      properties: {
                        ticketType: {
                          type: 'string',
                          enum: ['provider_login', 'loginProvider'],
                          description: 'Resource provider login problems'
                        },
                        name: {
                          type: 'string',
                          description: 'User full name',
                          example: 'Test User Bob - API Documentation'
                        },
                        accessId: {
                          type: 'string',
                          description: 'ACCESS ID',
                          example: 'TEST789456'
                        },
                        accessResource: {
                          type: 'string',
                          enum: [
                            'ACES', 'Anvil', 'Bridges-2', 'DARWIN', 'Delta', 'DeltaAI',
                            'Derecho', 'Expanse', 'FASTER', 'Granite', 'Jetstream2',
                            'KyRIC', 'Launch', 'Neocortex', 'Ookami', 'Open Science Grid',
                            'Open Storage Network', 'Ranch', 'Stampede3'
                          ],
                          description: 'ACCESS resource having login issues',
                          example: 'Expanse'
                        },
                        description: {
                          type: 'string',
                          description: 'Description of the login issue',
                          example: '[TEST DATA] SSH key authentication failing on Expanse login nodes - This is sample test data for API documentation'
                        },
                        userIdAtResource: {
                          type: 'string',
                          description: 'User ID at the resource provider',
                          example: 'testuser_bob'
                        },
                        attachments: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['fileName', 'contentType', 'fileData', 'size'],
                            properties: {
                              fileName: { type: 'string' },
                              contentType: { type: 'string' },
                              fileData: { type: 'string', format: 'base64' },
                              size: { type: 'integer' }
                            }
                          }
                        }
                      }
                    },
                    {
                      title: 'Feedback Submission (RT 17)',
                      type: 'object',
                      required: ['ticketType', 'description'],
                      properties: {
                        ticketType: {
                          type: 'string',
                          enum: ['feedback'],
                          description: 'User feedback and suggestions'
                        },
                        description: {
                          type: 'string',
                          description: 'Feedback content',
                          example: '[TEST DATA] The new portal interface is much easier to navigate - This is sample test data for API documentation'
                        },
                        email: {
                          type: 'string',
                          format: 'email',
                          description: 'Contact email (optional for anonymous feedback)'
                        },
                        name: {
                          type: 'string',
                          description: 'User name (optional for anonymous feedback)'
                        },
                        accessId: {
                          type: 'string',
                          description: 'ACCESS ID (optional for anonymous feedback)'
                        },
                        attachments: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['fileName', 'contentType', 'fileData', 'size'],
                            properties: {
                              fileName: { type: 'string' },
                              contentType: { type: 'string' },
                              fileData: { type: 'string', format: 'base64' },
                              size: { type: 'integer' }
                            }
                          }
                        }
                      }
                    }
                  ]
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
      },
      '/api/v1/security-incidents': {
        post: {
          summary: 'Create Security Incident Report',
          description: 'Creates a new security incident report in the dedicated ACCESS cybersecurity service desk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['serviceDeskId', 'requestTypeId', 'requestFieldValues'],
                  properties: {
                    serviceDeskId: {
                      type: 'integer',
                      enum: [3],
                      description: 'Service desk ID (must be 3 for security incidents)'
                    },
                    requestTypeId: {
                      type: 'integer',
                      enum: [26],
                      description: 'Request type ID (must be 26 for security incidents)'
                    },
                    requestFieldValues: {
                      type: 'object',
                      required: ['summary', 'priority', 'description', 'name', 'email', 'accessId'],
                      properties: {
                        summary: {
                          type: 'string',
                          maxLength: 255,
                          description: 'Brief summary of the security incident',
                          example: '[TEST DATA] Suspicious network activity detected'
                        },
                        priority: {
                          type: 'string',
                          enum: ['Critical', 'High', 'Medium', 'Low'],
                          description: 'Security incident priority level'
                        },
                        description: {
                          type: 'string',
                          description: 'Detailed description of the security incident',
                          example: '[TEST DATA] Multiple failed SSH attempts from unknown IP addresses - This is sample test data for API documentation'
                        },
                        name: {
                          type: 'string',
                          description: 'Reporter full name',
                          example: 'Test User Security - API Documentation'
                        },
                        email: {
                          type: 'string',
                          format: 'email',
                          description: 'Reporter email address',
                          example: 'test-security@example.edu'
                        },
                        accessId: {
                          type: 'string',
                          description: 'ACCESS ID of the reporter',
                          example: 'TEST789012'
                        }
                      }
                    },
                    attachments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['fileName', 'contentType', 'fileData', 'size'],
                        properties: {
                          fileName: {
                            type: 'string',
                            description: 'Name of the file',
                            example: 'test_network_logs.txt'
                          },
                          contentType: {
                            type: 'string',
                            description: 'MIME type of the file',
                            example: 'text/plain'
                          },
                          fileData: {
                            type: 'string',
                            format: 'base64',
                            description: 'Base64 encoded file content'
                          },
                          size: {
                            type: 'integer',
                            description: 'File size in bytes',
                            example: 2048
                          }
                        }
                      },
                      description: 'Evidence files, logs, screenshots (base64 encoded)'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Security incident report created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      version: { type: 'string', example: '1.0.0' },
                      timestamp: { type: 'string', format: 'date-time' },
                      data: {
                        type: 'object',
                        properties: {
                          ticketKey: { type: 'string', example: 'SEC-123' },
                          ticketUrl: { type: 'string', format: 'uri', example: 'https://access-ci.atlassian.net/servicedesk/customer/portal/3/SEC-123' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid request data or wrong service desk/request type',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string', example: 'Invalid service desk ID. Security incidents must use serviceDeskId: 3' },
                      details: { type: 'object' },
                      version: { type: 'string', example: '1.0.0' },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string', example: 'Internal server error' },
                      version: { type: 'string', example: '1.0.0' },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          },
          tags: ['Security']
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