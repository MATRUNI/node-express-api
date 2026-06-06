export function requireApiKey(req, res, next) {
    // Exclude health check from API key requirement so waking the cold server doesn't fail
    if (req.path === '/health') {
        return next();
    }

    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.FRONTEND_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
        console.warn(`[SECURITY] Blocked request without valid API Key from IP: ${req.ip}`);
        return res.status(403).json({
            error: "Forbidden: Invalid or missing API Key"
        });
    }

    next();
}
