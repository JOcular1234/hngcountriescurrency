const mysql = require('mysql2/promise');
require('dotenv').config();

// Railway provides MYSQLHOST, MYSQLUSER, etc.
// Local development uses DB_HOST, DB_USER, etc.
// This configuration supports both
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'countries_db',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Log configuration for debugging (without password)
console.log('📊 Database Configuration:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Port: ${dbConfig.port}`);

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database schema
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create countries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        capital VARCHAR(255),
        region VARCHAR(100),
        population BIGINT NOT NULL,
        currency_code VARCHAR(10),
        exchange_rate DECIMAL(20, 8),
        estimated_gdp DECIMAL(30, 2),
        flag_url TEXT,
        last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_region (region),
        INDEX idx_currency (currency_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create metadata table for tracking refresh timestamps
    await connection.query(`
      CREATE TABLE IF NOT EXISTS refresh_metadata (
        id INT AUTO_INCREMENT PRIMARY KEY,
        last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_countries INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Initialize metadata if empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM refresh_metadata');
    if (rows[0].count === 0) {
      await connection.query('INSERT INTO refresh_metadata (total_countries) VALUES (0)');
    }

    connection.release();
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('   Error Code:', error.code);
    console.error('   Error Number:', error.errno);
    console.error('   SQL State:', error.sqlState);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Ensure MySQL database is running');
    console.error('   2. Check environment variables are set correctly');
    console.error('   3. Verify database credentials');
    console.error('   4. Check network connectivity to database host\n');
    return false;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  testConnection
};
