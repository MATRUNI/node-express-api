import passport from 'passport';

export const handleGoogleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user) {
            console.error("Google Auth Failure:", err || info);
            return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed`);
        }
        req.user = user;
        next();
    })(req, res, next);
};