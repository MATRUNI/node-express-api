import jwt from 'jsonwebtoken'

export default function genRefreshToken(payload,res)
{
    const token=jwt.sign({...payload, type:"user"}, process.env.REFRESH_SECRET_KEY, {expiresIn:'30d'});
    const isProd = process.env.NODE_ENV === "production"
    res.cookie('refresh_token',token,{
        httpOnly:true,
        secure: isProd,
        sameSite: isProd?"none":"lax",
        partitioned: isProd,
        maxAge: 30*24*60*60*1000
    })
    console.log('Access token dipatched')
}