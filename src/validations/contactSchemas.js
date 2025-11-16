import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required(),
  phoneNumber: Joi.string().trim().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('home', 'work').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).optional(),
  phoneNumber: Joi.string().trim().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('home', 'work').optional(),
}).min(1);
