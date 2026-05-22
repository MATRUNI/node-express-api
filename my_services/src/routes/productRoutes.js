// import express from 'express'
// import {getData,deleteData,createData,updateData,findOne} from '../services/logic.js'
// import { typeCheck } from '../middlewares/typeCheck.js';
// let router=express.Router();

// router.get('/',async(req,res)=>{
//     let data=await getData();
//     res.json(data);
// });
// router.get('/:field/:type',async(req,res)=>{ // /key/value -> price/300
//     let {field,type}=req.params
//     type=isNaN(type)?type:Number(type)
//     let data=await findOne(field,type)
//     console.log(data)
//     if(data.length)
//     return res.json(data);
//     return res.status(404).json({error:"Doesn't exist"})
// });

// router.post('/',typeCheck,async(req,res)=>{
//     const {name,price,category,quantity}=req.body;
//     const data=await createData(name,price,category,quantity);
//     res.json(data);
// });

// router.delete('/:field/:type/:isOne',async(req,res)=>{
//     let {field,type,isOne}=req.params
//     console.log(type)
//     isOne = (isOne === 'true' || isOne===undefined);
//     let data=await deleteData(field,type,isOne)
//     data.push({lenght:data.length})
//     res.json(data);
// });

// export default router;