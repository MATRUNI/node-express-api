import express from 'express'
import { register } from '../controller/registerUser.js';
import { loginUser } from '../controller/loginUser.js';
import { logoutSession, refreshSession } from '../controller/authController.js';
import { optController, otpVerify } from '../controller/otpController.js';
// import { verifyHuman } from '../middlewares/verifyHuman.js';
import rateLimit from 'express-rate-limit';
import {verifySessionToken} from '../middlewares/verifySessionToken.js';

const authRouterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: process.env.NODE_ENV === 'local' ? 1000 : 20,
    message: "Too many authentication attempts from this IP, please try again after 1 hour"
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'local' ? 1000 : 5, // High limit for local testing
    message: "Too many authentication attempts from this IP, please try again after 15 minutes"
});

const router=express.Router();
router.use(authRouterLimiter)

router.post('/register', authLimiter,verifySessionToken(true), register)
router.post('/login', authLimiter, loginUser)
router.post('/refresh',refreshSession)
router.post('/logout', logoutSession)
router.post('/send-otp', authLimiter, optController)
router.post('/verify-otp', authLimiter, verifySessionToken(), otpVerify)
export default router