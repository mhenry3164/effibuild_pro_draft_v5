import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  clientId: Joi.string().uuid().required(),
  status: Joi.string().valid('active', 'completed', 'pending'),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid('active', 'completed', 'pending'),
}).min(1);