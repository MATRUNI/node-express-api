import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import AUDIO from '../models/AUDIOS.js';

const audioRouter = express.Router();

audioRouter.use(verifyToken);

audioRouter.get("/call-invite", async(req,res)=>{
    const audio = await AUDIO.findOne({name:"call-invite"})

    res.set("Content-Type", audio.mimeType);
    res.send(audio.data);
})

export default audioRouter;