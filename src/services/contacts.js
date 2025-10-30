const Contact = require("../models/Contact");

async function getAllContacts() {
  const contacts = await Contact.find({});
  return contacts;
}

async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}

module.exports = { getAllContacts, getContactById };
