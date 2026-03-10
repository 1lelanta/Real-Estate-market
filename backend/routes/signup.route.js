import express from 'express';
import { signup, signin, google, forgotPassword, resetPassword } from '../controllers/signup.controller.js';
import { signout } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google)
router.get('/signout',signout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router;
