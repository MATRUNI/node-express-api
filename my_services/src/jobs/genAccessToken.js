import jwt from 'jsonwebtoken'
import { getCookieOptions } from '../utils/cookieOptions.js';
export default function genAccessToken(payload,res)
{
        const token=jwt.sign({...payload, type:"user"}, process.env.SECRET_KEY,{expiresIn:"15m"});
        const isProd = process.env.NODE_ENV === "production"
        res.cookie('access_token',token,{
                ...getCookieOptions(),
                maxAge: 15*60*1000
        })
        console.log('Access token dipatched')
}