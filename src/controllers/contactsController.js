const contactsService = require("../services/contacts");

async function getContacts(req, res, next) {
  try {
    const contacts = await contactsService.getAllContacts();
    return res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getContacts, getContactById };
