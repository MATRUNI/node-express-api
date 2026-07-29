import mongoose from "mongoose";

export const audioDB = mongoose.createConnection(process.env.AUDIO_DB+"audios");

audioDB.on('connected', ()=>{
    console.log('Audio DB Connected')
})
audioDB.on('error',(error)=>{
    console.log('Audio DB Error:',error.message)
})