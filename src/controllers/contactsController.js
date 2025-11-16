import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

export const getAll = async (req, res, next) => {
  const { page = 1, perPage = 10, sortBy, sortOrder = 'asc', contactType, isFavourite } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const perPageNum = Math.max(Number(perPage) || 10, 1);

  const filters = {};
  if (contactType) filters.contactType = contactType;
  if (typeof isFavourite !== 'undefined') {
    if (isFavourite === 'true') filters.isFavourite = true;
    else if (isFavourite === 'false') filters.isFavourite = false;
  }

  const { data, totalItems } = await contactsService.getAllContacts({
    page: pageNum,
    perPage: perPageNum,
    sortBy,
    sortOrder,
    filters,
  });

  const totalPages = Math.ceil(totalItems / perPageNum);
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (!contact) throw createError(404, 'Contact not found');
  res
    .status(200)
    .json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
};

export const create = async (req, res, next) => {
  const newContact = await contactsService.createContact(req.body);
  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a contact!', data: newContact });
};

export const update = async (req, res, next) => {
  const { contactId } = req.params;
  const updated = await contactsService.updateContact(contactId, req.body);
  if (!updated) throw createError(404, 'Contact not found');
  res.status(200).json({ status: 200, message: 'Successfully patched a contact!', data: updated });
};

export const remove = async (req, res, next) => {
  const { contactId } = req.params;
  const removed = await contactsService.deleteContact(contactId);
  if (!removed) throw createError(404, 'Contact not found');
  res.status(204).send();
};
