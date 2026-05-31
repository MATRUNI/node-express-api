import jwt from 'jsonwebtoken'

export default function genRefreshToken(payload,res)
{
    const token=jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:'30d'});
    res.cookie('refresh_token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:"none",
        maxAge: 30*24*60*60*1000
    })
    console.log('Access token dipatched')
}