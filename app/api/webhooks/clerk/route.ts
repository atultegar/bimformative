import { Webhook} from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    // Create new svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error: Missing Svix headers", { status: 400 });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,  
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: Could not verify webhook', err);
        return new Response("Error: Verification error", { status: 400 });
    }

    // Do something with payload
    const eventType = evt.type;
    
    if (evt.type === "user.created" || evt.type === "user.updated") {
        const { id, email_addresses, image_url, username } = evt.data;
        
        // Insert or update profile
        await supabase.from("profiles").upsert({
            id,
            email: email_addresses?.[0]?.email_address ?? null,
            username,
            avatar_url: image_url,
            updated_at: new Date().toISOString(),
        });
    }

    return new Response("Webhook received", { status: 200 });
}