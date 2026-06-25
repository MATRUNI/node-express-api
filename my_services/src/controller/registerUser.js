import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import genAccessToken from "../jobs/genAccessToken.js";
import genRefreshToken from "../jobs/genRefreshToken.js";
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function register(req, res) {
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: "Validation failed", errors: validationResult.error.errors });
  }
  const {username, email, password } = validationResult.data;

  try 
  {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    const nameUser = await prisma.user.findUnique({
      where: { username }
    });

    if (nameUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified:true
      },
    });
    genAccessToken({userId:newUser.id}, res)
    await genRefreshToken({userId:newUser.id}, res)
    return res.status(201).json({
      message: "User created successfully",
      user: {username},
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Server error in register",
      error:error.message
    });
  }
}