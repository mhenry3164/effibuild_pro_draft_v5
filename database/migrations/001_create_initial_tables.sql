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

-- Insert Pearson Construction client
INSERT INTO clients (name, email, phone, company)
VALUES ('Terrell Pearson', 'mhenry3164@gmail.com', '662-424-1001', 'Pearson Construction');

-- Get the client ID
SET @client_id = LAST_INSERT_ID();

-- Insert Terrell Pearson as a user
INSERT INTO users (name, email, password, role, client_id)
VALUES (
  'Terrell Pearson',
  'mhenry3164@gmail.com',
  -- Password: EffiBuildPro01!
  '$2b$10$YourHashedPasswordHere',
  'client_admin',
  @client_id
);