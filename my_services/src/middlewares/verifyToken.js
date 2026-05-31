import jwt from 'jsonwebtoken'

export default async function verifyToken(req,res,next)
{
    const token = req.cookies?.access_token;
    if(!token) return res.status(401).json({message:"Access Denied"});
    try 
    {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user=verified;
        next() 
    } 
    catch (error) 
    {
        return res.status(403).json({ message: "Invalid or Expired Token" })
    }
}