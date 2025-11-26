import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as contactsCtrl from '../controllers/contactsController.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validations/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadSingle } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);

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
router.post(
  '/',
  authenticate,
  uploadSingle('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsCtrl.create)
);
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  uploadSingle('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactsCtrl.update)
);

export default router;
