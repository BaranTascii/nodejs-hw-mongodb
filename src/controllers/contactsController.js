import * as contactsService from '../services/contacts.js';

export const getAll = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully fetched all contacts!',
    data: contacts,
  });
};

export const getById = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  res.json({
    status: 200,
    message: 'Successfully fetched contact!',
    data: contact,
  });
};

export const create = async (req, res) => {
  const contact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const update = async (req, res) => {
  const updated = await contactsService.updateContact(req.params.contactId, req.body);
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const remove = async (req, res) => {
  await contactsService.deleteContact(req.params.contactId);
  res.status(204).send();
};
