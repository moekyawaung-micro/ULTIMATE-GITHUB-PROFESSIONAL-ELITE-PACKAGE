// docs/api-documentation.ts

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise API',
      version: '1.0.0',
      description: 'Comprehensive API documentation',
      contact: {
        name: 'API Support',
        email: 'api@example.com',
      },
    },
    servers: [
      {
        url: 'https://api.example.com',
        description: 'Production',
      },
      {
        url: 'https://staging-api.example.com',
        description: 'Staging',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'email'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupAPIDocumentation(app) {
  app.use('/api/docs', swaggerUi.serve);
  app.get('/api/docs', swaggerUi.setup(specs));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}
