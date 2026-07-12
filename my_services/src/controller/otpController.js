import OTP from '../models/OTP.js';
import prisma from '../lib/prisma.js';
import { SendOTP } from '../services/AuthLogic.js';
import { genSignUpSessionToken } from '../utils/tokenUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const optController = asyncHandler(async (req,res)=>
{
  const { email, username } = req.body;
  if (!email) {
    return res.status(400).json({ error: "PROTOCOL_ERROR: EMAIL_NULL" });
  }
  if (!username) {
    return res.status(400).json({ error: "PROTOCOL_ERROR: USERNAME_NULL" });
  }
  const [hasUsername,hasEmail] = await Promise.all([
    prisma.user.findUnique({where:{username}}),
    prisma.user.findUnique({where:{email}})
  ])
  if (hasUsername) {
    return res.status(409).json({
      field: "username",
      error: "USERNAME_ALREADY_EXISTS",
    });
  }
  
  if (hasEmail) {
    return res.status(409).json({
      field: "email",
      error: "EMAIL_ALREADY_EXISTS",
    });
  }
  const existing = await OTP.findOne({email});
  if(existing && existing.createdAt > Date.now()- 5 * 60 * 1000 ) 
    return res.status(429).json({error: "RATE_LIMIT: PLEASE_WAIT_BEFORE_REQUESTING_NEW_OTP"})

  await OTP.deleteMany({ email });
  const response = await SendOTP({ email });

  genSignUpSessionToken({ email, username,isVerified:false }, res);

  return res.status(200).json({
    success: true,
    message: response.message,
  });
})

export const otpVerify = asyncHandler(async (req,res)=> 
{
  const { otp } = req.body;
  const {email,username} = req.user
  if (!otp) {
    return res.status(400).json({ error: "VALIDATION_ERROR: PARAMS_MISSING" });
  }

  const record = await OTP.findOne({email});

  if (!record) 
  {
    return res.status(410).json({success:false ,error: "ACCESS_DENIED: CHALLENGE_TOKEN_EXPIRED" });
  }

  if (record.otp !== String(otp)) 
  {
    return res.status(400).json({success:false, error: "ACCESS_DENIED: TOKEN_MATCH_FAILED" });
  }
  await OTP.deleteOne({ _id: record._id });
  genSignUpSessionToken({ email, username,isVerified:true }, res);
  return res.status(200).json({success: true,message: "IDENTITY_VERIFIED" });
})