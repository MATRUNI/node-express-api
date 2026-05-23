import { ObjectId } from "mongodb";
import connectDB from "../config/db.js";
import API from "../models/API.js";

export async function getAPIs(apiInstance) 
{
    try 
    {    
        const data=await API.find({})
        return data
    } 
    catch (error) 
    {
        console.log("Error:",error.message)    
    }
}
export async function createNewApi(apiInstance) 
{
    try 
    {    
        const newAPI=await API(apiInstance)
        const saveAPI= await newAPI.save()
        console.log(saveAPI)
        return saveAPI
    } 
    catch (error) 
    {
        console.log("Error:",error.message)    
    }
}
export async function deleteApiByID(id) 
{
    try 
    {    
        return await API.findOneAndDelete({_id:new ObjectId(id)})
    } 
    catch (error) 
    {
        console.log("Error:",error.message)
    }
}