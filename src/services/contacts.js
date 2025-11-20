import { Contact } from '../models/contact.js';
import createError from 'http-errors';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = 'asc',
  filters = {},
} = {}) => {
  const skip = (page - 1) * perPage;
  const sort = {};
  if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  const query = { userId, ...filters };

  const [data, totalItems] = await Promise.all([
    Contact.find(query).sort(sort).skip(skip).limit(Number(perPage)).lean(),
    Contact.countDocuments(query),
  ]);

  return { data, totalItems };
};

export const getContactById = async (userId, id) => {
  const contact = await Contact.findOne({ _id: id, userId }).lean();
  return contact;
};

export const createContact = async (userId, payload) => {
  const obj = { ...payload, userId };
  return Contact.create(obj);
};

export const updateContact = async (userId, id, payload) => {
  const updated = await Contact.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  }).lean();
  return updated;
};

export const deleteContact = async (userId, id) => {
  const deleted = await Contact.findOneAndDelete({ _id: id, userId });
  return deleted;
};
