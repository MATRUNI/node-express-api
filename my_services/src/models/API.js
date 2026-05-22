import mongoose from 'mongoose'

const APISchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"API name is required"],
            trim:true,
            maxLength:[30,"Name can't exceed 30 characters"]
        },
        description:{
            type:String,
            required:true,
            minLength:[20,"Description should be at least 20 charcters"]
        },
        endpoint:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true
        },
        method:{
            type:String,
            required:true,
            uppercase:true,
            enum:{
                values:['GET','POST','PUT','DELETE'],
                message:"{VALUE} is not a valid HTTP method"
            }
        },
        category:{
            type:String,
            required:true,
            default:"General"
        },
        responseType:{
            type:String,
            required:true,
            enum:['JSON','XML','HTML','TEXT'],
            default:"JSON"
        }
    },
    {
        timestamps:true
    }
)
const API=mongoose.model('API',APISchema)
export default API;