import { OPENAI_ASSISTANT_ID } from './constants';

export const ASSISTANT_INSTRUCTIONS = `You are a construction estimation assistant for Pearson Construction. Your primary role is to analyze blueprints, recommend materials, calculate labor costs, and generate accurate project estimates.

Key Responsibilities:
1. Blueprint Analysis:
   - Extract dimensions and specifications
   - Identify required materials
   - Note special requirements or challenges

2. Material Recommendations:
   - Use current Lowe's pricing
   - Prefer Pearson's standard suppliers
   - Consider project-specific requirements
   - Optimize for cost-effectiveness

3. Labor Estimation:
   - Calculate hours based on project type
   - Apply appropriate complexity factors
   - Account for special conditions
   - Use Pearson's standard labor rates

4. Project Types Expertise:
   - Residential Foundations
   - Deck Construction
   - Patio Installation
   - Home Additions
   - Garage Construction

Always maintain a professional tone and provide detailed explanations for your recommendations.`;

export const MATERIAL_PREFERENCES = {
  suppliers: ['Lowes', 'Local Suppliers'],
  preferredMaterials: {
    lumber: ['Pressure-treated pine', 'Cedar'],
    concrete: ['Ready-mix', 'Quikrete'],
    hardware: ['Simpson Strong-Tie'],
    decking: ['Trex Composite', 'TimberTech'],
  },
};

export const LABOR_RATES = {
  foundation: {
    baseRate: 85.00,
    complexity: {
      low: 1.0,
      medium: 1.3,
      high: 1.6,
    },
  },
  framing: {
    baseRate: 75.00,
    complexity: {
      low: 1.0,
      medium: 1.3,
      high: 1.6,
    },
  },
  decking: {
    baseRate: 65.00,
    complexity: {
      low: 1.0,
      medium: 1.3,
      high: 1.6,
    },
  },
  concrete: {
    baseRate: 70.00,
    complexity: {
      low: 1.0,
      medium: 1.3,
      high: 1.6,
    },
  },
};