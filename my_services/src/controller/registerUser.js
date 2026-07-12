import bcrypt from "bcryptjs";
import { genAccessToken, genRefreshToken } from "../utils/tokenUtils.js";
import { z } from 'zod';
import { getCookieOptions } from "../utils/cookieOptions.js";
import { createUser } from "../services/AuthLogic.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const register = asyncHandler(async (req, res) => {
  const {password } = req.body;
  const {username, email} = req.user;
  const validationResult = registerSchema.safeParse({email,username,password});
  if (!validationResult.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR: PAYLOAD_INVALID", details: validationResult.error.issues });
  }

  try 
  {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
        username,
        email,
        password: hashedPassword,
        isVerified:true
      })
    res.clearCookie("session_token", getCookieOptions());
    genAccessToken({userId:newUser.id,username:newUser.username}, res)
    await genRefreshToken({userId:newUser.id,username:newUser.username}, res)
    return res.status(201).json({
      message: "USER_REGISTERED_SUCCESSFULLY",
      user: {username},
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "SERVER_ERROR: REGISTRATION_FAILED",
      details: error.message
    });
  }
})