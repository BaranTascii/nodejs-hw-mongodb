import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validations/authSchemas.js';
import { sendResetSchema, resetPwdSchema } from '../validations/authResetSchemas.js';
import * as authCtrl from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(authCtrl.register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(authCtrl.login));
router.post('/refresh', ctrlWrapper(authCtrl.refresh));
router.post('/logout', ctrlWrapper(authCtrl.logout));
router.post(
  '/send-reset-email',
  validateBody(sendResetSchema),
  ctrlWrapper(authCtrl.sendResetEmail)
);
router.post('/reset-pwd', validateBody(resetPwdSchema), ctrlWrapper(authCtrl.resetPassword));

export default router;
