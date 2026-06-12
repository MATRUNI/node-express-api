const WRITE_LOCK = true;

export function writeLock(req, res, next) {
    if (WRITE_LOCK) {
        return res.status(403).json({
            success: false,
            message: "Write operations are disabled"
        });
    }
}