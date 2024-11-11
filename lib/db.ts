import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || '34.46.9.11',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'Mattox--osc4',
  database: process.env.DATABASE_NAME || 'effibuild',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class Database {
  static async query<T>(sql: string, params: any[] = []): Promise<T> {
    try {
      const [results] = await pool.execute(sql, params);
      return results as T;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  static async testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to database');
      connection.release();
      return true;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      return false;
    }
  }
}

export { Database as db };

