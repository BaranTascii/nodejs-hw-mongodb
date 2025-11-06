import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

dotenv.config();

async function main() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start app:', error);
    process.exit(1);
  }
}

main();
