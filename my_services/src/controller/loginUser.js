import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { genAccessToken, genRefreshToken } from "../utils/tokenUtils.js";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid credentials"),
    password: z.string().min(1, "Invalid credentials")
});

export async function loginUser(req,res)
{
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: "VALIDATION_ERROR: PAYLOAD_INVALID", details: validationResult.error.issues });
    }
    const {email,password} = validationResult.data;

    const user= await prisma.user.findUnique({
        where:{email}
    });
    if(!user)
    {
        return res.status(401).json({ error: "AUTH_ERROR: INVALID_CREDENTIALS" });
    }

    const verifyPassword= await bcrypt.compare(password, user.password);

    if(!verifyPassword)
    {
        return res.status(401).json({ error: "AUTH_ERROR: INVALID_CREDENTIALS" });
    }
    await prisma.user.update({
        where:{email},
        data:{
            lastLogin: new Date()
        }
    });
    genAccessToken({userId:user.id,username:user.username}, res)
    await genRefreshToken({userId:user.id,username:user.username}, res)
    res.json({ message: "LOGIN_SUCCESSFUL", user: { username: user.username } });
}