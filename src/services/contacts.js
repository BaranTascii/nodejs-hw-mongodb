import { Contact } from '../../models/contact.js';

export async function findAllContacts() {
  return Contact.find().lean();
}

export async function findContactById(id) {
  return Contact.findById(id).lean();
}
