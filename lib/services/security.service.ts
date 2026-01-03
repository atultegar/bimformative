import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
});

export async function validateTurnstile(token: string) {
    const DEV_BYPASS = process.env.NODE_ENV !== "production";

    if (DEV_BYPASS) {
        return { success: true };
    }
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if(!secret) {
        throw new Error("TURNSTILE_SECRET_NOT_CONFIGURED");
    }

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secret}&response=${token}`,
        }
    );

    return response.json();
}

export async function rateLimitByIp(ip: string) {
    const { success } = await ratelimit.limit(ip);
    return success;
}