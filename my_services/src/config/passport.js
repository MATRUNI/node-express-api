import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../lib/prisma.js'
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if(!email)
        {
            return done(new Error("No email associated with this Google Account"),null)
        }
        const googleId = profile.id;

        let user = await prisma.user.findFirst({where:{
            OR:[
                {googleId},
                {email}
            ]
        }});

        if(!user)
        {
            user = await prisma.user.create({
                data:{
                    googleId,
                    email,
                    username:null,
                    isVerified:true
                }
            })
        }
        else if(!user.googleId)
        {
            user = await prisma.user.update({
                where:{id:user.id},
                data:{googleId,isVerified:true}
            })
        }

        return done(null, user);
        
    } catch (error) {
        return done(error, null); 
    }
}));