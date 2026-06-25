import express from 'express'
import { getMe, getUserProfile } from '../controller/userController.js';
import verifyToken from '../middlewares/verifyToken.js' 
const router=express.Router();

router.get('/me',verifyToken,getMe)
router.get('/profile',verifyToken,getUserProfile)

export default router