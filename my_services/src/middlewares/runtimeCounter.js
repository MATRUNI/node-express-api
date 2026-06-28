import prisma from '../lib/prisma.js';

export default function runtimeCounter(req, res, next) {
    const start = process.hrtime();

    res.on('finish', async () => {
        
        if (!req.user || !req.user.userId) return;

        const diff = process.hrtime(start);
        const timeTakenMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);

        const bytesSent = parseInt(res.getHeader('content-length') || '0', 10);

        const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
        const isClientError = res.statusCode >= 400 && res.statusCode < 500;
        const isServerError = res.statusCode >= 500;
        const isRateLimited = res.statusCode === 429;

        try {
            await prisma.$executeRaw`
                UPDATE "User"
                SET stats = stats || jsonb_build_object(
                    'total', COALESCE((stats->>'total')::int, 0) + 1,
                    'success', COALESCE((stats->>'success')::int, 0) + ${isSuccess ? 1 : 0}::int,
                    'client_errors', COALESCE((stats->>'client_errors')::int, 0) + ${isClientError ? 1 : 0}::int,
                    'server_errors', COALESCE((stats->>'server_errors')::int, 0) + ${isServerError ? 1 : 0}::int,
                    'rate_limited', COALESCE((stats->>'rate_limited')::int, 0) + ${isRateLimited ? 1 : 0}::int,
                    'total_compute_time_ms', COALESCE((stats->>'total_compute_time_ms')::bigint, 0) + ${timeTakenMs}::bigint,
                    'bytes_transferred', COALESCE((stats->>'bytes_transferred')::bigint, 0) + ${bytesSent}::bigint
                )
                WHERE id = ${req.user.userId}
            `;
        } catch (error) {
            console.error("Runtime Counter Error:", error.message);
        }
    });

    next();
}
