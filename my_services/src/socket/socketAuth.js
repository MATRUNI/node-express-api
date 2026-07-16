import jwt from 'jsonwebtoken'

export default function socketAuth(socket, next)
{
    const token = socket.request.cookies.access_token;
    if(!token)
    {
        return next(new Error("Authentication Error."))
    }
    try 
    {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        socket.user = user;
        next();    
    } 
    catch (error) 
    {
        next(new Error("Invalid token"))
    }
}