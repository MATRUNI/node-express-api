import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import genAccessToken from "../jobs/genAccessToken.js";
import genRefreshToken from "../jobs/genRefreshToken.js";
export async function loginUser(req,res)
{
    const {email,password}=req.body;

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
    genRefreshToken({userId:user.id}, res)
    res.json({message:"Logged in",user:{username:user.username,email:user.email}});
}