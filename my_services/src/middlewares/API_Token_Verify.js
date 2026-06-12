import jwt from 'jsonwebtoken'

export default async function API_Token_Verify(req,res,next)
{
    const token = req.cookies?.access_token;
    if(!token) return res.status(401).json({message:"Please sign in or create an account to access this endpoint."});
    try 
    {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user=verified;
        next() 
    } 
    catch (error) 
    {
        return res.status(401).json({ message: "Your session has expired. Please sign in again." })
    }
}