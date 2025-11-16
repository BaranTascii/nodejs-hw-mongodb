import express from 'express';
import * as contactsCtrl from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validations/contactSchemas.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsCtrl.getAll));
router.get('/:contactId', isValidId, ctrlWrapper(contactsCtrl.getById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(contactsCtrl.create));
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsCtrl.update)
);
router.delete('/:contactId', isValidId, ctrlWrapper(contactsCtrl.remove));

export default router;
