import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { error } from "console";

interface OwnerCheckOptions {
    adminOverride?: boolean; // allow admin to bypass ownership    
}

type ownerHandler = (args: {
    req: Request;
    userId: string;
    scriptId: string;
    script: any; // full script row from Supabase
}) => Promise<Response>;

export function withOwnerCheck(handler: ownerHandler, options: OwnerCheckOptions = {}) {
    return async ({ req, userId }: { req: Request; userId: string }) => {
        try {
            // Extract script ID from the url
            const url = new URL(req.url);
            const segments = url.pathname.split("/");
            const scriptId = segments[segments.indexOf("scripts") + 1];

            if (!scriptId) {
                return NextResponse.json(
                    { error: "Missing script ID" },
                    { status: 400 }
                );
            }

            // Get the script from Supabase
            const supabase = supabaseServer();
            const { data: script, error } = await supabase
                .from("dynscripts")
                .select("*")
                .eq("id", scriptId)
                .single();

            if (error || !script) {
                return NextResponse.json(
                    { error: "Script not found" },
                    { status: 404 }
                );
            }

            // Admin override
            if (options.adminOverride) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", userId)
                    .single();

                if (profile?.role === "admin") {
                    return handler({ req, userId, scriptId, script });
                }
            }

            // Dev user override (for testing locally)
            if (userId === "dev-user"){
                return handler({ req, userId, scriptId, script });
            }

            // Ownership check
            if (script.owner_id !== userId) {
                return NextResponse.json(
                    { error: "Forbidden - You do not own this script", userId},
                    { status: 403 }
                );
            }

            // All good - run the handler
            return handler({ req, userId, scriptId, script });
        } catch (err) {
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}