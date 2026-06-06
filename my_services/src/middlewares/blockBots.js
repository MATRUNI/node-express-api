import { isbot } from 'isbot';

export function blockBots(req, res, next) {
    const userAgent = req.get('User-Agent');
    
    // Check if the user agent is a known bot/crawler
    if (userAgent && isbot(userAgent)) {
        console.warn(`[SECURITY] Blocked known bot/crawler. IP: ${req.ip}, User-Agent: ${userAgent}`);
        return res.status(403).json({
            error: "Forbidden: Bot access is strictly prohibited"
        });
    }

    next();
}
