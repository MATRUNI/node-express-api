import mongoose from "mongoose";
export const APIConfig_db = mongoose.createConnection(
    process.env.MONGO_URI+"APIConfig_db"
);
APIConfig_db.on('connected', ()=>{
    console.log("ConfigDB Connected")
})