import express from 'express'
import Me from '../secure/Me.js';
import verifyToken from '../middlewares/verifyToken.js' 
const router=express.Router();

router.get('/me',verifyToken,Me)

export default router