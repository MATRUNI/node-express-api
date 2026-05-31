import jwt from 'jsonwebtoken'
export default function genAccessToken(payload,res)
{
        const token=jwt.sign(payload, process.env.SECRET_KEY,{expiresIn:"15m"});
        res.cookie('access_token',token,{
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:"none",
                maxAge: 15*60*1000
        })
        console.log('Access token dipatched')
}