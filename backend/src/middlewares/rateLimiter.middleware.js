import redisClient from "../config/redis.js";

const rateLimiter = (limit, windowSeconds) => {
    return async (req, res, next) => {
        try {
            const ip =req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
                req.socket.remoteAddress;
            const key = `rate:${ip}`;

            const currentCount = await redisClient.incr(key);

            if (currentCount === 1) {
                await redisClient.expire(key, windowSeconds);
            }

            if (currentCount > limit) {
                return res.status(429).json({
                    success: false,
                    message: `Too many requests. Try again after ${windowSeconds} seconds.`,
                });
            }

            next();
        } catch (error) {
            console.error("Rate Limiter Error:", error);
            next();
        }
    };
};

export default rateLimiter;