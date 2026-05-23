import express from 'express'
import { createNewApi, deleteApiByID, getAPIs } from '../services/APILogic.js';

let router=express.Router();

router.get("/",async (req,res)=>{
    let data=await getAPIs();
    res.json({data})
})

router.post('/',async (req,res)=>{
    let apiInstance=req.body
    let data=await createNewApi(apiInstance)
    res.json({Success:true,data})
})
router.delete('/:id',async (req,res)=>{
    let {id}=req.params
    let data=await deleteApiByID(id)
    res.json({Success:true,data})
})
export default router