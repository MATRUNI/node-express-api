import jwt from 'jsonwebtoken';
import { getCookieOptions } from './cookieOptions.js';
import prisma from '../lib/prisma.js';
import crypto from 'crypto';

export function genSignUpSessionToken(payload, res) {
    const durationMins = payload.isVerified ? 15 : 5;
    const durationMs = durationMins * 60 * 1000;

    const token = jwt.sign({ ...payload }, process.env.SECRET_KEY, { expiresIn: `${durationMins}m` });
    res.cookie('session_token', token, {
        ...getCookieOptions(),
        maxAge: durationMs + 10000
    });
    console.log(`Sign Up Session Token dispatched (${durationMins}m)`);
}
export function genAccessToken(payload, res) {
    const token = jwt.sign({ ...payload, type: "user" }, process.env.SECRET_KEY, { expiresIn: "15m" });
    res.cookie('access_token', token, {
        ...getCookieOptions(),
        maxAge: 15 * 60 * 1000
    });
    console.log('Access token dispatched');
}

export async function genRefreshToken(payload, res) {
    const token = jwt.sign({ ...payload, type: "user" }, process.env.REFRESH_SECRET_KEY, { expiresIn: '30d' });
    res.cookie('refresh_token', token, {
        ...getCookieOptions(),
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    await prisma.user.update({
        where: {
            id: payload.userId
        },
        data: {
            hashedRefreshToken: hashedToken
        }
    });
    console.log('Refresh token dispatched');
}
