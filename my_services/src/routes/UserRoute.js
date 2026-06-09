import express from 'express'
import Me from '../secure/Me.js';
import verifyToken from '../middlewares/verifyToken.js' 
import getUserProfile from '../secure/getUserProfile.js';
const router=express.Router();

router.get('/me',verifyToken,Me)
router.get('/profile',verifyToken,getUserProfile)

export default router