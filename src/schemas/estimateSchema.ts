import Joi from 'joi';

const estimateItemSchema = Joi.object({
  id: Joi.string().uuid(),
  description: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unitPrice: Joi.number().positive().required(),
});

export const createEstimateSchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  status: Joi.string().valid('draft', 'sent', 'approved', 'rejected'),
  items: Joi.array().items(estimateItemSchema).min(1).required(),
});

export const updateEstimateSchema = Joi.object({
  status: Joi.string().valid('draft', 'sent', 'approved', 'rejected'),
  items: Joi.array().items(estimateItemSchema).min(1),
}).min(1);