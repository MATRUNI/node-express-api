import { ObjectId } from "mongodb";
import connectDB from "../config/db.js";
import API from "../models/API.js";

export async function getAPIs(apiInstance) 
{
    return await API.find({})
}
export async function createNewApi(apiInstance) 
{
    const newAPI=new API(apiInstance)
    return await newAPI.save()
}
export async function deleteApiByID(id) 
{
    return await API.findOneAndDelete({_id:new ObjectId(id)})
}