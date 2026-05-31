import prisma from "../lib/prisma.js";
export default async function Me(req,res)
{
    try
    {
        const {userId}=req.user;
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
          username: user.username,
          email: user.email
        });
    }
    catch(error)
    {
        res.status(500).json({ message: "Invalid session" });
    }
}