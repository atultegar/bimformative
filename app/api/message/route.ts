import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Define the response data type
type Data = {message?: string, error?: string};

// Email validation schema
const EmailSchema = z
    .string()
    .email({ message: "Please enter a valid email address"});

const BEARER_TOKEN = process.env.SANITY_BEARER_TOKEN;
const url = "https://wlb0lt21.api.sanity.io/v2024-01-01/data/mutate/production";
const error_message = "There was a problem, please try again.";
const success_message = "Awesome! Message sent successfully!";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 requests per minute
});

async function validateTurnstile(token: string) {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secret}&response=${token}`,
        }
    );

    return await response.json();
}

//Subscription handler function
export const POST = async (request: Request) => {
    const body = await request.json();
    const turnstileToken = body.turnstileToken;

    if (!turnstileToken) {
        NextResponse.json(
            { error: "Missing Turnstile token" },
            { status: 400 }
        );
    }

    // Validate Turnstile
    const turnstileResult = await validateTurnstile(turnstileToken);
    if (!turnstileResult.success) {
        return NextResponse.json(
            { error: "Bot detected. Verification failed." },
            { status: 401 }
        );
    }
    
    // Rate limiter
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests"},
            { status: 429 }
        );
    }


    // 1. Validate email address    
    const res = await request.json();
    const email = res.email;

    const emailValidation = EmailSchema.safeParse(email);

    if (!emailValidation.success) {
        return NextResponse.json({ error: "Please enter a valid email address"}, {status: 400});
    }
    

    if (!BEARER_TOKEN) {
        return NextResponse.json(
          { error: "Sanity credentials are not properly set" },
          { status: 500 }
        );
    }

    
    // 4. Prepare request data
    
    const data = {
        mutations: [
            {
                createOrReplace: {
                    _type: "contactmessage",
                    createdAt: new Date().toISOString(),
                    name: res.name,
                    email: emailValidation.data,
                    subject: res.subject,
                    message: res.message,
                    newsletter: res.newsletter || false,
                }
            }
        ]
    };

    // 5. Set request headers
    const options = {
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json"
        },
    };

    // 6. Send POST request to Mailchimp API
    try {
        const response = await axios.post(url, data, options);
        if (response.status === 200){
            return NextResponse.json({
                message: success_message,
            }, { status: 200});
        } else {
            return NextResponse.json({
                message: error_message,
            }, {status: 500});
        }
    } catch (e) {
        return NextResponse.json({
            message: error_message,
        }, {status:500});
    }    
};
