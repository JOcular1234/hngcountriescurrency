-- Country Currency Exchange API - Database Schema
-- This file is for reference only. The application will create these tables automatically.

-- Create database
CREATE DATABASE IF NOT EXISTS countries_db;
USE countries_db;

-- Countries table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh metadata table
CREATE TABLE IF NOT EXISTS refresh_metadata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_countries INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initialize metadata
INSERT INTO refresh_metadata (total_countries) VALUES (0);

-- Show tables
SHOW TABLES;
DESCRIBE countries;
DESCRIBE refresh_metadata;
