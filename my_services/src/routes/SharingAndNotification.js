import express from "express";
import { shareData, getSharedDataRecipients, consumeSharedConfig, searchUsernames } from "../controller/sharingDataController.js";
import verifyToken from "../middlewares/verifyToken.js"
import rateLimit from "express-rate-limit"

const isLocal = process.env.NODE_ENV === 'local';

const sharingRoute = express.Router();
const sharingRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: isLocal ? 1000 : 10,
    message: "Too many requests from this IP, please try again after 1 hour"
});
sharingRoute.use(verifyToken)

const shareUserInfoLimiter = rateLimit({
    windowMs:1000,
    max:isLocal ? 100 : 3,
    keyGenerator:(req)=>{
        return req.user.id
    },
    message:"Too many requests."
})
// not ready yet
// sharingRoute.post("/config", sharingRateLimiter, shareData)
// sharingRoute.get("/recipients", getSharedDataRecipients)
// sharingRoute.post("/consume/:sharedDataId", consumeSharedConfig)
sharingRoute.get("/users/search/:value",shareUserInfoLimiter, searchUsernames)
export default sharingRoute;