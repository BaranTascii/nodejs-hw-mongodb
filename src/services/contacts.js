import { Contact } from '../models/contact.js';

export const getAllContacts = async ({ page = 1, perPage = 10, sortBy, sortOrder = 'asc', filters = {} } = {}) => {
  const skip = (page - 1) * perPage;
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }
  const query = { ...filters };

  const [data, totalItems] = await Promise.all([
    Contact.find(query).sort(sort).skip(skip).limit(Number(perPage)).lean(),
    Contact.countDocuments(query)
  ]);

  return { data, totalItems };
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId).lean();
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true }).lean();
};

export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
