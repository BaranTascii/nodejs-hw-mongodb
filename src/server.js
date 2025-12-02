import express from "express";
import cors from "cors";

import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";

import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
