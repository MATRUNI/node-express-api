import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { getCookieOptions } from '../utils/cookieOptions.js';
import crypto from 'crypto'
import { genAccessToken, genRefreshToken, genSignUpSessionToken } from '../utils/tokenUtils.js';
export async function refreshSession(req, res) {
    try {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh Token Missing" });
        }

        const hashedIncomingToken = crypto.createHash('sha256').update(refreshToken).digest('hex')

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        
        if (!user || user.hashedRefreshToken !== hashedIncomingToken) {
            return res.status(403).json({ message: "User session node untethered" });
        }
        genAccessToken({userId:user.id, username:user.username}, res)
        return res.status(200).json({ message: "SESSION_ACCESS_RENEWED" });
    } catch (error) {
        console.error("Refresh sequence aborted:", error.message);
        return res.status(403).json({ message: "Refresh token expired or invalid" });
    }
}
export async function logoutSession(req, res) {
    const refreshToken = req.cookies?.refresh_token
    if (!refreshToken) {
        res.clearCookie('access_token', getCookieOptions());
        res.clearCookie('refresh_token', getCookieOptions());
        return res.status(200).json({ message: "SESSION_TERMINATED: GOODBYE_OPERATOR" });
    }
    
    try {   
        const decoded = jwt.decode(refreshToken);
        if(decoded && decoded.userId)
        {
            await prisma.user.update({
                where:{
                    id: decoded.userId
                },
                data:{
                    hashedRefreshToken: null
                }
            })
        }

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
    res.clearCookie('access_token', getCookieOptions());
    res.clearCookie('refresh_token', getCookieOptions());
    console.log(`[AUTH LOGOUT] | tokens cleared | ${new Date().toISOString()}`);
    return res.status(200).json({ message: "SESSION_TERMINATED: GOODBYE_OPERATOR" });
}

export const googleCallbackController = async (req, res) => {
    try {
        const user = req.user; 

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
        if (!user.username) {
            genSignUpSessionToken({userId:user.id, isVerified:true}, res)
            return res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
        }

        genAccessToken({userId:user.id,username:user.username},res);
        await genRefreshToken({userId: user.id,username:user.username}, res);

        return res.redirect(`${process.env.FRONTEND_URL}`);

    } catch (error) {
        console.error("Google Auth Callback Error:", error);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};

export const completeOnboarding = async (req, res) => {
    try {
        const { username } = req.body;
        
        const { userId } = req.user;

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(409).json({ field: "username", error: "USERNAME_ALREADY_EXISTS" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username }
        });

        res.clearCookie('session_token');

        genAccessToken({ userId: updatedUser.id, username: updatedUser.username }, res);
        await genRefreshToken({ userId: updatedUser.id, username: updatedUser.username }, res);

        return res.status(200).json({
            message: "ONBOARDING_COMPLETE",
            user: { id: updatedUser.id, username: updatedUser.username }
        });

    } catch (error) {
        console.error("Onboarding Error:", error);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
};
