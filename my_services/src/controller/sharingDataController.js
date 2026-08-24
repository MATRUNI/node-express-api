import { asyncHandler } from "../utils/asyncHandler.js";
import { putSharedData,
    getSharedDataUser,
    consumeData,
    getUsernamesWithPrefix
 } from "../services/shareing.js";
import { z } from "zod";

const ApiConfigSchema = z.object({
  url: z.url(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),

  headers: z.record(z.string(), z.string()).default({}),

  query: z.record(z.string(), z.string()).default({}),

  path: z.record(z.string(), z.string()).default({}),

  body: z.unknown().optional(),
}).strip();
export const shareData = asyncHandler(async(req,res)=>{
    const { recievers, config, message } = req.body;
    const {userId} = req.user
    const sanitizedData = ApiConfigSchema.safeParse(config);
    if (!sanitizedData.success) {
        return res.status(400).json({ error: "Invalid configuration format", details: sanitizedData.error.errors });
    }
    
    if (!Array.isArray(recievers) || recievers.length === 0) {
        return res.status(400).json({ error: "At least one receiver is required" });
    }

    const response = await putSharedData({data:sanitizedData.data,sender:userId,recievers,message})
    
    if (!response.success) {
        return res.status(500).json(response);
    }
    
    res.json(response)
})

export const getSharedDataRecipients = asyncHandler(async(req,res)=>{
    const {userId} = req.user;
    const usernames = await getSharedDataUser(userId);
    res.json({ usernames });
})

export const consumeSharedConfig = asyncHandler(async(req,res)=>{
    const {userId} = req.user;
    const {sharedDataId} = req.params;
    
    if(!sharedDataId) {
        return res.status(400).json({ error: "Shared Data ID is required" });
    }

    const response = await consumeData({userId, sharedDataId});
    res.json(response);
})

export const searchUsernames = asyncHandler(async(req,res)=>{
    const { value } = req.params
    if(!(value.length>=2))
    {
        return res.status(400).json({error: "Search value must be at least 3 characters long"})
    }
    const usernames = await getUsernamesWithPrefix({pre:value});
    
    return res.status(200).json(usernames)
})