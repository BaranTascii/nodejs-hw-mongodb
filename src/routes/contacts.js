const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactsController');

router.get('/', controller.getContacts);
router.get('/:contactId', controller.getContactById);

module.exports = router;
