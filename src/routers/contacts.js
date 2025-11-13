import express from 'express';
import * as contactsCtrl from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsCtrl.getAll));
router.get('/:contactId', ctrlWrapper(contactsCtrl.getById));
router.post('/', ctrlWrapper(contactsCtrl.create));
router.patch('/:contactId', ctrlWrapper(contactsCtrl.update));
router.delete('/:contactId', ctrlWrapper(contactsCtrl.remove));

export default router;
