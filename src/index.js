require("dotenv").config();
const initMongoConnection = require("./db/initMongoConnection");
const setupServer = require("./server");

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
  } catch (error) {
    console.error("Application failed to start:", error.message);
    process.exit(1);
  }
})();
