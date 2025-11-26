import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.json({ message: 'Contacts API is running.' }));

// auth routes (public)
app.use('/auth', authRouter);

// contacts routes (router applies authentication internally)
app.use('/api/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
