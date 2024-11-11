CREATE TABLE IF NOT EXISTS labor_rates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_type VARCHAR(50) NOT NULL,
  base_rate DECIMAL(10, 2) NOT NULL,
  complexity_factors JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_project_type (project_type)
);

-- Insert default labor rates
INSERT INTO labor_rates (
  project_type,
  base_rate,
  complexity_factors
) VALUES
  ('foundation', 85.00, '{"low": 1, "medium": 1.3, "high": 1.6}'),
  ('framing', 75.00, '{"low": 1, "medium": 1.3, "high": 1.6}'),
  ('roofing', 65.00, '{"low": 1, "medium": 1.3, "high": 1.6}'),
  ('drywall', 55.00, '{"low": 1, "medium": 1.3, "high": 1.6}'),
  ('painting', 45.00, '{"low": 1, "medium": 1.3, "high": 1.6}');