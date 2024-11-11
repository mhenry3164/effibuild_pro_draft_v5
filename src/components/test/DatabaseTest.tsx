import { useState, useEffect } from 'react';
import { db } from '@/lib/db';

export default function DatabaseTest() {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        const result = await db.query('SELECT NOW() as time');
        setStatus('Connected successfully! Server time: ' + JSON.stringify(result));
      } catch (error) {
        setStatus('Connection failed: ' + error.message);
        console.error('Database error:', error);
      }
    }

    testConnection();
  }, []);

  return (
    <div className='p-4 border rounded shadow-sm'>
      <h2 className='text-lg font-semibold mb-2'>Database Connection Test</h2>
      <p className='text-sm'>{status}</p>
    </div>
  );
}
