import express from 'express'
import { createNewApi, deleteApiByID, getAPIs } from '../services/APILogic.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeLock } from '../middlewares/writeLock.js';
import optionalAuth from '../middlewares/optionalAuth.js';

let router=express.Router();

router.get("/",optionalAuth,asyncHandler(async (req,res)=>{
    let data=await getAPIs(req.user);
    res.json({data})
}))

router.post('/',writeLock,asyncHandler(async (req,res)=>{
    let apiInstance=req.body
    let data=await createNewApi(apiInstance)
    res.status(201).json({Success:true,data})
}))
router.delete('/:id',writeLock,asyncHandler(async (req,res)=>{
    let {id}=req.params
    let data=await deleteApiByID(id)
    res.json({Success:true,data})
}))
export default router