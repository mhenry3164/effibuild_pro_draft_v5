-- Initial database setup for EffiBuild Pro

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS effibuild;
USE effibuild;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo VARCHAR(255),
  assistant_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  client_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255),
  address TEXT NOT NULL,
  notes TEXT,
  client_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'completed', 'pending') DEFAULT 'pending',
  client_id VARCHAR(36) NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Create estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_id VARCHAR(36) NOT NULL,
  status ENUM('draft', 'sent', 'approved', 'rejected') DEFAULT 'draft',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create estimate_items table
CREATE TABLE IF NOT EXISTS estimate_items (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estimate_id VARCHAR(36) NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

-- Insert initial master admin user
INSERT INTO users (id, name, email, password, role)
VALUES (
  UUID(),
  'Master Admin',
  'admin@effibuildpro.com',
  -- Password: Mattox$14 (this should be properly hashed in production)
  '$2b$10$YourHashedPasswordHere',
  'master_admin'
);

-- Insert Pearson Construction client
INSERT INTO clients (id, name, email, phone, company)
VALUES (
  UUID(),
  'Terrell Pearson',
  'mhenry3164@gmail.com',
  '662-424-1001',
  'Pearson Construction'
);

-- Get the client ID for Pearson Construction
SET @pearson_id = (SELECT id FROM clients WHERE email = 'mhenry3164@gmail.com');

-- Insert Terrell Pearson as a user
INSERT INTO users (id, name, email, password, role, client_id)
VALUES (
  UUID(),
  'Terrell Pearson',
  'mhenry3164@gmail.com',
  -- Password: EffiBuildPro01! (this should be properly hashed in production)
  '$2b$10$YourHashedPasswordHere',
  'client_admin',
  @pearson_id
);