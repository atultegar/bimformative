import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const supabase = supabaseServer();

        let migrated = 0;
        let skipped = 0;
    
        const result = await clerk.users.getUserList({limit: 100});
        const users = result.data;

        if (!users || users.length === 0) {
            return NextResponse.json({
                migrated: 0,
                skipped: 0,
                message: "No users found in Clerk.",                
            });
        }

        for (const user of users) {
            const clerkId = user.id;

            // Check if already exists
            const { data: existing } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", clerkId)
                .single();

            if (existing) {
                skipped++;
                continue;
            }

            // Insert new profile
            const { error } = await supabase.from("profiles").insert({
                id: clerkId,
                email: user.emailAddresses?.[0]?.emailAddress ?? null,
                username: user.username ?? "",
                first_name: user.firstName ?? "",
                last_name: user.lastName ?? "",
                avatar_url: user.imageUrl ?? "",
                created_at: new Date(user.createdAt).toISOString(),
                updated_at: new Date(user.updatedAt).toISOString(),
            });

            if (error) {
                console.error("Insert error for", clerkId, error);
                skipped++;
                continue;
            }

            migrated++;
        }

        return NextResponse.json({
            migrated,
            skipped,
            totalClerkUsers: users.length,
            message: "Migration complete",
        });
    } catch (err) {
        return NextResponse.json(
            { error: "Migration failed", details: err },
            { status: 500 }
        );
    }
}