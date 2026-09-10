import mongoose from "mongoose";
import APIConfig from "../models/API_Config.js"
import API from "../models/API.js";

export const getById = async (id)=>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, message: "Invalid ID" };
    }

    const data = await APIConfig.findById(id);

    if (!data) {
        return { success: false, message: "Not found" };
    }

    return { success: true, data };
}

export const setAPIConfig = async (config,id)=>{
    const {title} = config
    const apiconfog = new APIConfig(config)

    try {
        const [data] = await Promise.all([
            API.findById(id),
            apiconfog.validate()
        ])
        
        if( !data || !title.includes(data.name))
        {
            return {success:false,message:"API doesn't exist"}
        }

        const [creation,updation] = await Promise.all([
            APIConfig.create({_id:id,...config}),
            API.updateOne({_id:id},{$set:{hasConfig:true}})
        ]);
        return {success:true,data:creation}
    } catch (error) {
        return {success:false,message:"Validation error",error}
    }
}