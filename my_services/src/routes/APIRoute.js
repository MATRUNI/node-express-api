import express from 'express'
import { createNewApi, deleteApiByID, getAPIs } from '../services/APILogic.js';
import { asyncHandler } from '../utils/asyncHandler.js';

let router=express.Router();

router.get("/",asyncHandler(async (req,res)=>{
    let data=await getAPIs();
    res.json({data})
}))

router.post('/',asyncHandler(async (req,res)=>{
    let apiInstance=req.body
    let data=await createNewApi(apiInstance)
    res.status(201).json({Success:true,data})
}))
router.delete('/:id',asyncHandler(async (req,res)=>{
    let {id}=req.params
    let data=await deleteApiByID(id)
    res.json({Success:true,data})
}))
export default router