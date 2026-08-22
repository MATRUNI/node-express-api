import express from "express";
import { shareData, getSharedDataCount, consumeSharedConfig, searchUsernames } from "../controller/sharingDataController.js";
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
sharingRoute.post("/share", sharingRateLimiter, shareData)
sharingRoute.get("/share/count", getSharedDataCount)
sharingRoute.post("/share/consume/:sharedDataId", consumeSharedConfig)
sharingRoute.get("/users/search/:value",shareUserInfoLimiter, searchUsernames)
export default sharingRoute;