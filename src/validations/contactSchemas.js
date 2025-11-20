import Joi from 'joi';

const commonString = Joi.string().trim().min(3).max(20);

export const createContactSchema = Joi.object({
  name: commonString.required(),
  phoneNumber: commonString.required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: commonString.optional(),
  phoneNumber: commonString.optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
}).min(1);
