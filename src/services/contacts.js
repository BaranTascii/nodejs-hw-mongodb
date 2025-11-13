import { Contact } from '../models/contact.js';
import createError from 'http-errors';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) throw createError(404, 'Contact not found');
  return contact;
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (contactId, data) => {
  const updated = await Contact.findByIdAndUpdate(contactId, data, { new: true });
  if (!updated) throw createError(404, 'Contact not found');
  return updated;
};

export const deleteContact = async (contactId) => {
  const deleted = await Contact.findByIdAndDelete(contactId);
  if (!deleted) throw createError(404, 'Contact not found');
};
