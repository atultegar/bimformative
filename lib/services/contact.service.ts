import { client } from "@/app/lib/sanity";
import { ContactPayload } from "../types/contact";
import { rateLimitByIp, validateTurnstile } from "./security.service";
import z from "zod";
import { subscribeToKit } from "./kit.service";

const EmailSchema = z
    .string()
    .email({ message: "Please enter a valid email address"});

export async function submitContactMessage(
    payload: ContactPayload,
    ip: string
) {
    // 1. Rate limit
    const success = await rateLimitByIp(ip);

    if (!success) {
        return {
            ok: false,
            status: 429,
            error: "Too many requests",
        };
    }

    // 2. Turstile validation
    if (!payload.turnstileToken) {
        return {
            ok: false,
            status: 400,
            error: "Missing Turnstile token",
        };
    }

    const turnstileResult = await validateTurnstile(payload.turnstileToken);
    if (!turnstileResult.success) {
        return {
            ok: false,
            status: 401,
            error: "Bot detected. Verification failed.",
        };
    }

    // 3. Email validation
    const emailValidation = EmailSchema.safeParse(payload.email);
    if (!emailValidation.success) {
        return {
            ok: false,
            status: 400,
            error: "Please enter a valid email address",
        };
    }

    // 4. Sanity write
    try {
        await client.create({
            _type: "contactmessage",
            createdAt: new Date().toISOString(),
            name: payload.name,
            email: emailValidation.data,
            subject: payload.subject,
            message: payload.message,
            newsletter: payload.newsletter ?? false,
        });

        let subMessage: string = "";

        if (payload.newsletter) {
            const subRes = await subscribeToKit(payload.email);
            if (subRes) subMessage = " You are subscribed to newsletter."
        }

        return {
            ok: true,
            status: 200,
            message: "Awesome! Message sent successfully!" + subMessage,
        };
    } catch (err) {
        console.error("Sanity create error:", err);

        return {
            ok: false,
            status: 500,
            error: "There was a problem, please try again."
        };
    }
}