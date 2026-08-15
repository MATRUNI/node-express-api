import express from "express";
import { shareData, getSharedDataCount, consumeSharedConfig } from "../controller/sharingDataController.js";
import verifyToken from "../middlewares/verifyToken.js"
import rateLimit from "express-rate-limit"

const sharingRoute = express.Router();
const sharingRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: process.env.NODE_ENV === 'local' ? 1000 : 10,
    message: "Too many requests from this IP, please try again after 1 hour"
});
sharingRoute.use(verifyToken)
sharingRoute.post("/share", sharingRateLimiter, shareData)
sharingRoute.get("/share/count", getSharedDataCount)
sharingRoute.post("/share/consume/:sharedDataId", consumeSharedConfig)

export default sharingRoute;