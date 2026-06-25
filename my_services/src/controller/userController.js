import prisma from "../lib/prisma.js";

export async function getMe(req, res) {
    try {
        const { userId } = req.user;
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            username: user.username
        });
    } catch (error) {
        return res.status(500).json({ message: "Invalid session" });
    }
}

export async function getUserProfile(req, res) {
    try {
        const { userId } = req.user;
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            success: true,
            profile: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                isVerified: user.isVerified,
                stats: user.savedAPI
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
