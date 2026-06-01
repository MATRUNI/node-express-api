import express from 'express'
import { register } from '../controller/registerUser.js';
import { loginUser } from '../controller/loginUser.js';
import { logoutSession, refreshSession } from '../controller/authController.js';
import { optController, otpVerify } from '../controller/otpController.js';

const router=express.Router();

router.post('/register',register)
router.post('/login',loginUser)
router.post('/refresh',refreshSession)
router.post('/logout', logoutSession)
router.post('/send-otp', optController)
router.post('/verify-otp', otpVerify)
export default router