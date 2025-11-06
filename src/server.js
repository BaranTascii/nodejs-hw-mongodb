const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const contactsRouter = require('./routes/contacts');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp()); // basic pino http logger

  // Register routes
  app.use('/contacts', contactsRouter);

  // 404 handler for non-existing routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Global error handler (optional but useful)
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  // Start server function
  function start(port) {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  return { app, start };
}

module.exports = setupServer;
