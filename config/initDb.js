const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;

  try {
    console.log('Attempting to connect to database...');
    console.log(`Connecting to: ${process.env.DB_HOST}:${process.env.DB_PORT}`);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT || 3306),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      connectTimeout: 60000
    });

    console.log('✅ Connected to MySQL server');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database ${process.env.DB_NAME} ready`);

    await connection.query(`USE \`${process.env.DB_NAME}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Schools table ready');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    if (connection) await connection.end();
  }
}

initializeDatabase();
