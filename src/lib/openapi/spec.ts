// src/lib/openapi/spec.ts
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Overwatch API Client',
    version: '1.0.0',
    description: 'A TypeScript API client for Overwatch player data using the OverFast API',
    contact: {
      name: 'API Support',
      email: 'yassinne.jlassii@gmail.com'
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Returns the health status of the API',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number', example: 123.45 },
                    service: { type: 'string', example: 'Overwatch API Client' },
                    version: { type: 'string', example: '1.0.0' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/user/{battletag}': {
      get: {
        tags: ['User'],
        summary: 'Get user data',
        description: 'Get combined summary and stats data for a specific player',
        parameters: [
          {
            name: 'battletag',
            in: 'path',
            required: true,
            description: 'Player BattleTag (format: Name-1234)',
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z0-9]{3,12}-[0-9]{4,5}$',
              example: 'Prometheus-1252'
            }
          },
          {
            name: 'platform',
            in: 'query',
            description: 'Gaming platform',
            schema: {
              type: 'string',
              enum: ['pc', 'console'],
              default: 'pc'
            }
          },
          {
            name: 'gamemode',
            in: 'query',
            description: 'Game mode filter',
            schema: {
              type: 'string',
              enum: ['competitive', 'quickplay']
            }
          }
        ],
        responses: {
          '200': {
            description: 'User data retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            summary: { $ref: '#/components/schemas/PlayerSummary' },
                            stats: { $ref: '#/components/schemas/PlayerStats' }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'Player not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/user/{battletag}/summary': {
      get: {
        tags: ['User'],
        summary: 'Get user summary',
        description: 'Get only the summary data for a specific player',
        parameters: [
          {
            name: 'battletag',
            in: 'path',
            required: true,
            description: 'Player BattleTag (format: Name-1234)',
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z0-9]{3,12}-[0-9]{4,5}$',
              example: 'Prometheus-1252'
            }
          },
          {
            name: 'platform',
            in: 'query',
            description: 'Gaming platform',
            schema: {
              type: 'string',
              enum: ['pc', 'console'],
              default: 'pc'
            }
          }
        ],
        responses: {
          '200': {
            description: 'User summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/PlayerSummary' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/user/{battletag}/stats': {
      get: {
        tags: ['User'],
        summary: 'Get user statistics',
        description: 'Get only the statistics data for a specific player',
        parameters: [
          {
            name: 'battletag',
            in: 'path',
            required: true,
            description: 'Player BattleTag (format: Name-1234)',
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z0-9]{3,12}-[0-9]{4,5}$',
              example: 'Prometheus-1252'
            }
          },
          {
            name: 'platform',
            in: 'query',
            description: 'Gaming platform',
            schema: {
              type: 'string',
              enum: ['pc', 'console'],
              default: 'pc'
            }
          },
          {
            name: 'gamemode',
            in: 'query',
            description: 'Game mode filter',
            schema: {
              type: 'string',
              enum: ['competitive', 'quickplay']
            }
          }
        ],
        responses: {
          '200': {
            description: 'User statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/PlayerStats' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/user/{battletag}/full': {
      get: {
        tags: ['User'],
        summary: 'Get full user data',
        description: 'Get the complete raw data from the OverFast API for a specific player',
        parameters: [
          {
            name: 'battletag',
            in: 'path',
            required: true,
            description: 'Player BattleTag (format: Name-1234)',
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z0-9]{3,12}-[0-9]{4,5}$',
              example: 'Prometheus-1252'
            }
          },
          {
            name: 'platform',
            in: 'query',
            description: 'Gaming platform',
            schema: {
              type: 'string',
              enum: ['pc', 'console'],
              default: 'pc'
            }
          },
          {
            name: 'gamemode',
            in: 'query',
            description: 'Game mode filter',
            schema: {
              type: 'string',
              enum: ['competitive', 'quickplay']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Full user data retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/FullPlayerData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    }
  },
  components: {
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        },
        required: ['success', 'timestamp']
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        },
        required: ['success', 'error', 'timestamp']
      },
      PlayerSearchResult: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          player_id: { type: 'string' },
          name: { type: 'string' },
          title: { type: 'string', nullable: true },
          career_url: { type: 'string' },
          blizzard_id: { type: 'string' },
          avatar: { type: 'string' },
          namecard: { type: 'string' },
          privacy: { type: 'string', enum: ['public', 'private'] },
          last_updated_at: { type: 'string', format: 'date-time' }
        }
      },
      PlayerSummary: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          avatar: { type: 'string' },
          namecard: { type: 'string' },
          title: { type: 'string', nullable: true },
          endorsement: {
            type: 'object',
            properties: {
              level: { type: 'integer' },
              frame: { type: 'string' }
            }
          },
          competitive: {
            type: 'object',
            properties: {
              pc: { $ref: '#/components/schemas/CompetitiveData' },
              console: { $ref: '#/components/schemas/CompetitiveData' }
            }
          },
          privacy: { type: 'string', enum: ['public', 'private'] },
          last_updated_at: { type: 'integer' }
        }
      },
      CompetitiveData: {
        type: 'object',
        nullable: true,
        properties: {
          season: { type: 'integer' },
          tank: { $ref: '#/components/schemas/CompetitiveRank' },
          damage: { $ref: '#/components/schemas/CompetitiveRank' },
          support: { $ref: '#/components/schemas/CompetitiveRank' },
          open: { $ref: '#/components/schemas/CompetitiveRank' }
        }
      },
      CompetitiveRank: {
        type: 'object',
        nullable: true,
        properties: {
          skill_rating: { type: 'integer' },
          division: { type: 'string' },
          tier: { type: 'integer' },
          role_icon: { type: 'string' },
          rank_icon: { type: 'string' },
          tier_icon: { type: 'string' }
        }
      },
      PlayerStats: {
        type: 'object',
        nullable: true,
        additionalProperties: {
          type: 'object',
          nullable: true,
          additionalProperties: { $ref: '#/components/schemas/GameModeStats' }
        }
      },
      GameModeStats: {
        type: 'object',
        properties: {
          general: {
            type: 'object',
            properties: {
              time_played: { type: 'number' },
              games_played: { type: 'integer' },
              games_won: { type: 'integer' },
              games_lost: { type: 'integer' },
              winrate: { type: 'number' },
              kda: { type: 'number' }
            }
          },
          roles: {
            type: 'object',
            additionalProperties: { $ref: '#/components/schemas/RoleStats' }
          },
          heroes_comparisons: { $ref: '#/components/schemas/HeroesComparisons' },
          career_stats: { $ref: '#/components/schemas/CareerStats' }
        }
      },
      RoleStats: {
        type: 'object',
        properties: {
          time_played: { type: 'number' },
          games_played: { type: 'integer' },
          games_won: { type: 'integer' },
          winrate: { type: 'number' }
        }
      },
      HeroesComparisons: {
        type: 'object',
        additionalProperties: { $ref: '#/components/schemas/ComparisonData' }
      },
      ComparisonData: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          values: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                hero: { type: 'string' },
                value: { type: 'number' }
              }
            }
          }
        }
      },
      CareerStats: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              label: { type: 'string' },
              stats: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    label: { type: 'string' },
                    value: { oneOf: [{ type: 'number' }, { type: 'string' }] }
                  }
                }
              }
            }
          }
        }
      },
      FullPlayerData: {
        type: 'object',
        properties: {
          summary: { $ref: '#/components/schemas/PlayerSummary' },
          stats: { $ref: '#/components/schemas/PlayerStats' }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Bad request - validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints'
    },
    {
      name: 'Search',
      description: 'Player search functionality'
    },
    {
      name: 'User',
      description: 'User data retrieval endpoints'
    }
  ]
};