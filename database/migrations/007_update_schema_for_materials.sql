-- Create materials table with Lowe's integration
CREATE TABLE IF NOT EXISTS materials (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  lowes_sku VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(50) DEFAULT 'Lowes',
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lowes_sku (lowes_sku),
  INDEX idx_category (category)
);

-- Create material price history
CREATE TABLE IF NOT EXISTS material_price_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  material_id VARCHAR(36) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  INDEX idx_material_date (material_id, recorded_at)
);

-- Update labor rates table
CREATE TABLE IF NOT EXISTS labor_rates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_type VARCHAR(50) NOT NULL,
  base_rate DECIMAL(10, 2) NOT NULL,
  complexity_factors JSON NOT NULL,
  client_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  UNIQUE KEY unique_project_client (project_type, client_id)
);

-- Create estimates table with enhanced tracking
CREATE TABLE IF NOT EXISTS estimates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_id VARCHAR(36) NOT NULL,
  client_id VARCHAR(36) NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft',
  total_materials_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_labor_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  markup_percentage DECIMAL(5, 2) DEFAULT 0.00,
  total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create estimate materials table
CREATE TABLE IF NOT EXISTS estimate_materials (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estimate_id VARCHAR(36) NOT NULL,
  material_id VARCHAR(36) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  ai_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- Create estimate labor table
CREATE TABLE IF NOT EXISTS estimate_labor (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estimate_id VARCHAR(36) NOT NULL,
  project_type VARCHAR(50) NOT NULL,
  hours DECIMAL(10, 2) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  complexity_factor DECIMAL(4, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

-- Insert default labor rates for Pearson Construction
INSERT INTO labor_rates (
  project_type,
  base_rate,
  complexity_factors,
  client_id
) VALUES
  ('foundation', 85.00, '{"low": 1.0, "medium": 1.3, "high": 1.6}', 
   (SELECT id FROM clients WHERE company = 'Pearson Construction' LIMIT 1)),
  ('framing', 75.00, '{"low": 1.0, "medium": 1.3, "high": 1.6}',
   (SELECT id FROM clients WHERE company = 'Pearson Construction' LIMIT 1)),
  ('decking', 65.00, '{"low": 1.0, "medium": 1.3, "high": 1.6}',
   (SELECT id FROM clients WHERE company = 'Pearson Construction' LIMIT 1)),
  ('concrete', 70.00, '{"low": 1.0, "medium": 1.3, "high": 1.6}',
   (SELECT id FROM clients WHERE company = 'Pearson Construction' LIMIT 1));