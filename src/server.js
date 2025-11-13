import express from 'express';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Contacts API is running. Use /api/contacts to access endpoints.',
  });
});

app.use('/api/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
