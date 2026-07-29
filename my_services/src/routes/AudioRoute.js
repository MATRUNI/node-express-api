import express from 'express'
import API_Token_Verify from '../middlewares/API_Token_Verify.js'
import AUDIO from '../models/AUDIOS.js';

const audioRouter = express.Router();

audioRouter.use(API_Token_Verify);

audioRouter.get("/call-invite", async(req,res)=>{
    const audio = await AUDIO.findOne({name:"call-invite"})

    res.set("Content-Type", audio.mimeType);
    res.send(audio.data);
})

export default audioRouter;