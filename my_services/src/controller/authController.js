import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export async function refreshSession(req, res) {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh Token Missing" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        
        if (!user) {
            return res.status(404).json({ message: "User session node untethered" });
        }
        const newAccessToken = jwt.sign(
            { userId: user.id }, 
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );
        const isProd = process.env.NODE_ENV === "production"
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd?"none":"lax",
            maxAge: 15 * 60 * 1000 
        });

        return res.status(200).json({ message: "SESSION_ACCESS_RENEWED" });

    } catch (error) {
        console.error("Refresh sequence aborted:", error.message);
        return res.status(403).json({ message: "Refresh token expired or invalid" });
    }
}

export async function logoutSession(req, res) {
    try {
        const isProd = process.env.NODE_ENV === "production"
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd?"none":"lax"
        });

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd?"none":"lax"
        });
        console.log(`[AUTH LOGOUT] | tokens cleared | ${new Date().toISOString()}`);
        return res.status(200).json({ message: "SESSION_TERMINATED: GOODBYE_OPERATOR" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}