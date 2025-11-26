import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadBufferToCloudinary = (buffer, folder = 'contacts') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

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
    userId: req.user._id,
    page: pageNum,
    perPage: perPageNum,
    sortBy,
    sortOrder,
    filters,
  });

  const totalPages = Math.ceil(totalItems / perPageNum);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      hasPreviousPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
    },
  });
};

export const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(req.user._id, contactId);
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
  try {
    let photoUrl = null;
    if (req.file && req.file.buffer) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'contacts');
      photoUrl = result.secure_url;
    }
    const contact = await contactsService.createContact(req.user._id, {
      ...req.body,
      photo: photoUrl,
    });
    res
      .status(201)
      .json({ status: 201, message: 'Successfully created a contact!', data: contact });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    let photoUrl;
    if (req.file && req.file.buffer) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'contacts');
      photoUrl = result.secure_url;
    }
    const payload = { ...req.body };
    if (photoUrl) payload.photo = photoUrl;
    const { contactId } = req.params;
    const updated = await contactsService.updateContact(req.user._id, contactId, payload);
    if (!updated) throw createError(404, 'Contact not found');
    res
      .status(200)
      .json({ status: 200, message: 'Successfully patched a contact!', data: updated });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleted = await contactsService.deleteContact(req.user._id, contactId);
    if (!deleted) throw createError(404, 'Contact not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
