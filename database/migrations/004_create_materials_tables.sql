-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  supplier VARCHAR(50) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sku (sku),
  INDEX idx_category (category),
  INDEX idx_supplier (supplier)
);

-- Create material_price_history table
CREATE TABLE IF NOT EXISTS material_price_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  material_id VARCHAR(36) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  INDEX idx_material_date (material_id, recorded_at)
);