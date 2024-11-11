import { db } from './db';

async function test() {
  try {
    await db.testConnection();
    const result = await db.query('SELECT NOW() as time');
    console.log('Test query result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();

