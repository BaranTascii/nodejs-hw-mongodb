const mongoose = require('mongoose');

async function initMongoConnection({ user, password, url, dbName }) {
  const credentials = user && password ? `${user}:${encodeURIComponent(password)}@` : '';
  const uri = `mongodb+srv://${credentials}${url}/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = initMongoConnection;
