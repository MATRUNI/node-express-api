import mongoose from "mongoose";
import { audioDB } from "../config/audio_DB.js";

const AudioSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        mimeType:{
            type:String,
            required: true
        },
        data:{
            type:Buffer,
            required:true
        }
    }
)
const AUDIO = audioDB.model("audio",AudioSchema)
export default AUDIO;