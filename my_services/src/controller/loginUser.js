import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import genAccessToken from "../jobs/genAccessToken.js";
import genRefreshToken from "../jobs/genRefreshToken.js";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid credentials"),
    password: z.string().min(1, "Invalid credentials")
});

export async function loginUser(req,res)
{
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: "Validation failed", errors: validationResult.error.errors });
    }
    const {email,password} = validationResult.data;

    const user= await prisma.user.findUnique({
        where:{email}
    });
    if(!user)
    {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const verifyPassword= await bcrypt.compare(password, user.password);

    if(!verifyPassword)
    {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    await prisma.user.update({
        where:{email},
        data:{
            lastLogin: new Date()
        }
    });
    genAccessToken({userId:user.id}, res)
    await genRefreshToken({userId:user.id}, res)
    res.json({message:"Logged in",user:{username:user.username}});
}