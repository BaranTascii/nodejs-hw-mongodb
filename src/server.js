const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const contactsRouter = require("./routes/contacts");

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());

  app.use("/contacts", contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  function start(port) {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  return { app, start };
}

module.exports = setupServer;
