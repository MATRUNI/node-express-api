import jwt from 'jsonwebtoken'

export const verifySessionToken = (requireVerified = false) => {
  return (req, res, next) => {
    const token = req.cookies?.session_token;

    if (!token) {
      return res.status(401).json({
        error: "AUTH_ERROR: ACCESS_DENIED",
      });
    }

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);

      if (requireVerified && !verified.isVerified) {
        return res.status(403).json({
          error: "AUTH_ERROR: USER_NOT_VERIFIED",
        });
      }

      req.user = verified;
      return next();
    } catch {
      return res.status(403).json({
        error: "AUTH_ERROR: INVALID_OR_EXPIRED_TOKEN",
      });
    }
  };
};