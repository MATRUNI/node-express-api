import express from 'express'
import {getData,deleteData,createData,updateData,findOne} from '../services/logic.js'
import { typeCheck } from '../middlewares/typeCheck.js';
let router=express.Router();

router.get('/',async(req,res)=>{
    let data=await getData();
    res.json(data);
});
router.get('/:field/:type',async(req,res)=>{
    let {field,type}=req.params
    let data=await findOne(field,type)
    res.json(data);
});

router.post('/',typeCheck,async(req,res)=>{
    const {name,price,category,quantity}=req.body;
    const data=await createData(name,price,category,quantity);
    res.json(data);
});

router.delete('/:field/:type/:isOne',async(req,res)=>{
    let {field,type,isOne}=req.params
    isOne = (isOne === 'true' || isOne===undefined);
    let data=await deleteData(field,type,isOne)
    data.push({lenght:data.length})
    res.json(data);
});

export default router;