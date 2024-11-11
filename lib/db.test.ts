import { db } from './db';

async function testConnection() {
  try {
    await db.query('SELECT 1');
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

testConnection();
