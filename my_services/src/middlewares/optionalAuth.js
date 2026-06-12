import jwt from "jsonwebtoken";

export default async function optionalAuth (req,res,next)
{
    const token = req.cookies?.access_token;
    if(!token)
    {
        req.user = null;
        return next();
    }
    try
    {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verified;
    }
    catch (error)
    {
        req.user = null;
    }
    next();
}