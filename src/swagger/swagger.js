import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const __dirname = path.resolve();

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
    },
  },
  apis: [path.join(__dirname, 'docs/openapi.yaml')],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
