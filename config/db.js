const mysql = require('mysql2/promise');
require('dotenv').config();

let sslConfig;

if (process.env.DB_SSL && process.env.DB_SSL.toLowerCase() === 'true') {
  sslConfig = { rejectUnauthorized: false };
} else {
  sslConfig = undefined;  // explicitly undefined, no SSL
}

console.log('DB_SSL env:', process.env.DB_SSL);
console.log('sslConfig:', sslConfig);

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: sslConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000
    });

pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

module.exports = pool;
