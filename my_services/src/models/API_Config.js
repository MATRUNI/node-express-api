import mongoose from "mongoose";
import { APIConfig_db } from "../config/APIConfig_DB.js";

const ConfigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        baseUrl: {
            type: String,
            required: true,
            trim: true
        },
        endpoints: {
            type: [mongoose.Schema.Types.Mixed],
            default: null
        }
    },
    {
        timestamps: true
    }
);
const APIConfig = APIConfig_db.model('ApiConfiguration', ConfigSchema);
export default APIConfig;