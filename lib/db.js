const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "34.46.9.11",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "Mattox--osc4",
  database: process.env.DATABASE_NAME || "effibuild",
  socketPath: process.env.NODE_ENV === "production"
    ? "/cloudsql/" + process.env.DATABASE_INSTANCE
    : undefined,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = {
  async query(sql, params = []) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  },

  async transaction(callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = { db };
