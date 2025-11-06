require('dotenv').config();
const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

(async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB, PORT } = process.env;

    await initMongoConnection({
      user: MONGODB_USER,
      password: MONGODB_PASSWORD,
      url: MONGODB_URL,
      dbName: MONGODB_DB,
    });

    const { start } = setupServer();
    start(PORT);
  } catch (err) {
    console.error('Failed to start application', err);
    process.exit(1);
  }
})();
