import prisma from '../lib/prisma.js';

export default function runtimeCounter(req, res, next) {
    res.on('finish', async () => {
        
        if (!req.user || !req.user.userId) return;

        const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
        const incrementSuccess = isSuccess ? 1 : 0;
        const incrementFailed = !isSuccess ? 1 : 0;

        try {
            await prisma.$executeRaw`
                UPDATE "User"
                SET stats = stats || jsonb_build_object(
                    'total', COALESCE((stats->>'total')::int, 0) + 1,
                    'success', COALESCE((stats->>'success')::int, 0) + ${incrementSuccess}::int,
                    'failed', COALESCE((stats->>'failed')::int, 0) + ${incrementFailed}::int
                )
                WHERE id = ${req.user.userId}
            `;
        } catch (error) {
            console.error("Runtime Counter Error:", error.message);
        }
    });

    next();
}
