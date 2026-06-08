import crypto from 'crypto'
import { requestOTP } from '../utils/requestOTP.js';
import OTP from '../models/OTP.js';
export async function optController(req,res)
{
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "PROTOCOL_ERROR: EMAIL_NULL" });
  }

  try {
    const existing = await OTP.findOne({email});
    if(existing && existing.createdAt > Date.now()- 5 * 60 * 1000 ) 
      return res.status(429).json({error: "RATE_LIMIT: PLEASE_WAIT_BEFORE_REQUESTING_NEW_OTP"})
    await OTP.deleteMany({ email });
    
    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({email,otp})
    let response=await requestOTP({email, otp})

    if(response.success)
    {
      return res.status(200).json({ success: true, message: "CHALLENGE_TOKEN_DESPATCHED" });
    }
    else
      throw new Error("SMTP dispatch failed")
  } catch (error) {
    return res.status(500).json({ error: "DISPATCH_FAILED: SMTP_GATEWAY_FAULT" });
  }
}

export async function otpVerify(req,res) 
{
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "VALIDATION_ERROR: PARAMS_MISSING" });
  }

  const record = await OTP.findOne({email});

  if (!record) 
  {
    return res.status(410).json({ error: "ACCESS_DENIED: CHALLENGE_TOKEN_EXPIRED" });
  }

  if (record.otp !== String(otp)) 
  {
    return res.status(401).json({ error: "ACCESS_DENIED: TOKEN_MATCH_FAILED" });
  }
  await OTP.deleteOne({ _id: record._id });
  return res.status(200).json({ success: true, message: "IDENTITY_VERIFIED" });
}