-- Create estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_id VARCHAR(36) NOT NULL,
  blueprint_id VARCHAR(36),
  customer_id VARCHAR(36) NOT NULL,
  status ENUM('draft', 'sent', 'approved', 'rejected') DEFAULT 'draft',
  total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (blueprint_id) REFERENCES blueprints(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Create estimate_materials table
CREATE TABLE IF NOT EXISTS estimate_materials (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estimate_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  ai_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);