import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import genAccessToken from "../jobs/genAccessToken.js";
import genRefreshToken from "../jobs/genRefreshToken.js";

export async function register(req, res) {
  const {username, email, password } = req.body;

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
    genRefreshToken({userId:newUser.id}, res)
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Server error in register",
      error:error.message
    });
  }
}