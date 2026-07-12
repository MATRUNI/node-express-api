import crypto from 'crypto'
import OTP from "../models/OTP.js";
import { requestOTP } from '../utils/requestOTP.js';
import prisma from '../lib/prisma.js';

export async function SendOTP({email}) 
{    
    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({email,otp})
    let response=await requestOTP({email, otp})

    if(response.success)
    {
      return { success: true, message: "CHALLENGE_TOKEN_DESPATCHED" };
    }
    else
      throw new Error("SMTP dispatch failed")
}

export async function createUser(payload) 
{
  try 
  {
    const newUser = await prisma.user.create({data:{...payload}})
    return newUser;
  } catch (error) {
    throw new Error("Server Error");
  }
}