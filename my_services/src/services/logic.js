// import {db} from '../config/db';

// export const initDB= async()=>{
//     return await db.connectDB();
// }
// export const getData= async()=>{
//     return await db.getAllData();
// }
// export const createData= async(name,price,category,quantity)=>{
//     let d=await db.postData(name, price, category, quantity)
//     return await db.getAllData();
// }

// export const findOne=async(field,type)=>{
//     return db.findOne(field, type)
// }

// export const deleteData=async(field,type,isOne)=>{  // field->kay, type->value
//     let d=await db.deleteData(field,type,isOne);
//     return await db.getAllData()
// }
// export const updateData=async(name,field)=>{
//     await db.updateData({name}, field);
//     return await db.getAllData()
// }