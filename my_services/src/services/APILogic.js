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
        const newAPI=API(apiInstance)
        const saveAPI= newAPI.save()
        console.log(saveAPI)
        return saveAPI
    } 
    catch (error) 
    {
        console.log("Error:",error.message)    
    }
}