import mongoose from "mongoose";
import APIConfig from "../models/API_Config.js"

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