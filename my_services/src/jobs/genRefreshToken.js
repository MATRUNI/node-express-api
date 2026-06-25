import jwt from 'jsonwebtoken'
import { getCookieOptions } from '../utils/cookieOptions.js';
import prisma from '../lib/prisma.js';
import crypto from 'crypto';
export default async function genRefreshToken(payload,res)
{
    const token=jwt.sign({...payload, type:"user"}, process.env.REFRESH_SECRET_KEY, {expiresIn:'30d'});
    const isProd = process.env.NODE_ENV === "production"
    res.cookie('refresh_token',token,{
        ...getCookieOptions(),
        maxAge: 30*24*60*60*1000
    })

    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
    await prisma.user.update({
            where: {
                id: payload.userId
            },
            data:{
                hashedRefreshToken: hashedToken
            }
    })
    console.log('Refresh token dipatched')
}