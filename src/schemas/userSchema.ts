import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'project_manager', 'sales_rep').required(),
  clientId: Joi.string().uuid(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  role: Joi.string().valid('admin', 'project_manager', 'sales_rep'),
  clientId: Joi.string().uuid().allow(null),
}).min(1);