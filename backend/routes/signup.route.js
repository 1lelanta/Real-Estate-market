import express from 'express';
import { signup, signin,google } from '../controllers/signupController.js';
import { signout } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google)
router.get('/signout',signout)

export default router;
