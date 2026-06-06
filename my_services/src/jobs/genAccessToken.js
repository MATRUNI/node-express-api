import jwt from 'jsonwebtoken'
export default function genAccessToken(payload,res)
{
        const token=jwt.sign({...payload, type:"user"}, process.env.SECRET_KEY,{expiresIn:"15m"});
        const isProd = process.env.NODE_ENV === "production"
        res.cookie('access_token',token,{
                httpOnly:true,
                secure: isProd,
                sameSite: isProd?"none":"lax",
                partitioned: isProd,
                maxAge: 15*60*1000
        })
        console.log('Access token dipatched')
}