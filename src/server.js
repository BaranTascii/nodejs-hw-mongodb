import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getAllContacts, getContactById } from './controllers/contactsController.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());

  app.get('/contacts', getAllContacts);
  app.get('/contacts/:contactId', getContactById);

  app.use((req, res) => res.status(404).json({ message: 'Not found' }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
