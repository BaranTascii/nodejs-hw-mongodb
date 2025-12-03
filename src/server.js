import express from 'express';
import cors from 'cors';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/swagger/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Swagger docs → http://localhost:3000/api-docs');
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
