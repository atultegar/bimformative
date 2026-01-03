import axios from "axios";
import { z } from "zod";
import { KitError, SubscribeResult } from "../types/kit";

const EmailSchema = z
    .string()
    .email({ message: "Please enter a valid email address"});

const API_KEY = process.env.KIT_API_KEY;
const FORM_ID = process.env.KIT_FORM_ID;
const BASE_URL = "https://api.convertkit.com/v3";

export async function subscribeToKit(email: unknown): Promise<SubscribeResult> {
    // 1. Validate email
    const parsed = EmailSchema.safeParse(email);
    if(!parsed.success) {
        throw new KitError("INVALID_EMAIL");
    }

    if (!API_KEY || !FORM_ID) {
        throw new KitError("KIT_NOT_CONFIGURED");
    }

    // 2. Build request
    const url = `${BASE_URL}/forms/${FORM_ID}/subscribe`;

    const payload = {
        api_key: API_KEY,
        email: parsed.data,
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });

        if (response.status !== 200) {
            throw new KitError("SUBSCRIBE_FAILED");
        }

        return {
            success: true,
            message: "Awesome! You have successfully subscribed!",
        };
    } catch (err) {
        throw new KitError("SUBSCRIBE_FAILED");
    }
}