import Joi from 'joi';

export const createClientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  company: Joi.string().required(),
  companyLogo: Joi.string().uri().allow(null, ''),
  customAISettings: Joi.object({
    modelPreferences: Joi.object({
      temperature: Joi.number().min(0).max(1),
      maxTokens: Joi.number().integer().min(1),
      topP: Joi.number().min(0).max(1),
    }),
    industrySpecificTerms: Joi.array().items(Joi.string()),
    customPrompts: Joi.object().pattern(Joi.string(), Joi.string()),
    estimationRules: Joi.object({
      marginPercentage: Joi.number().min(0),
      roundingPrecision: Joi.number().integer().min(0),
      contingencyFactor: Joi.number().min(0),
    }),
  }).allow(null),
});

export const updateClientSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  company: Joi.string(),
  companyLogo: Joi.string().uri().allow(null, ''),
  customAISettings: Joi.object({
    modelPreferences: Joi.object({
      temperature: Joi.number().min(0).max(1),
      maxTokens: Joi.number().integer().min(1),
      topP: Joi.number().min(0).max(1),
    }),
    industrySpecificTerms: Joi.array().items(Joi.string()),
    customPrompts: Joi.object().pattern(Joi.string(), Joi.string()),
    estimationRules: Joi.object({
      marginPercentage: Joi.number().min(0),
      roundingPrecision: Joi.number().integer().min(0),
      contingencyFactor: Joi.number().min(0),
    }),
  }).allow(null),
}).min(1);