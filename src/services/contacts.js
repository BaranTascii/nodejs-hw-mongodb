import { Contact } from '../models/contact.js';

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

export const getContactById = async (userId, id) => Contact.findOne({ _id: id, userId }).lean();

export const createContact = async (userId, payload) => {
  const obj = { ...payload, userId };
  return Contact.create(obj);
};

export const updateContact = async (userId, id, payload) =>
  Contact.findOneAndUpdate({ _id: id, userId }, payload, { new: true }).lean();

export const deleteContact = async (userId, id) => Contact.findOneAndDelete({ _id: id, userId });
