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
    script: any;
    version?: any;
    params: Record<string, string>;
}) => Promise<Response>;

export function withOwnerCheck(
    handler: ownerHandler, 
    options: OwnerCheckOptions = {}
) {
    return async (ctx: { req: Request; userId: string; params?: Record<string, string> }) => {

        const { req, userId, params = {} } = ctx;

        try {
            const supabase = supabaseServer();

            let scriptId: string | null = null;
            let version: any = null;

            const resolvedParams = await params;

            // 1. HANDLE VERSION ROUTE: /api/script-versions/[versionId]
            if (resolvedParams.versionId) {
                const { data: versionRow, error: verErr } = await supabase
                    .from("dynscript_versions")
                    .select("id, script_id, version_number, is_current")
                    .eq("id", resolvedParams.versionId)
                    .single();

                if (verErr || !versionRow) {
                    return NextResponse.json(
                        { error: "Version not found" },
                        { status: 404 }
                    );
                }

                version = versionRow;
                scriptId = versionRow.script_id;
            }

            // 2. HANDLE SCRIPT ROUTE: /api/scripts/by-id/[scriptId]
            if (!scriptId) {
                scriptId = resolvedParams.scriptId || resolvedParams.id || null;
            }

            if (!scriptId) {
                return NextResponse.json(
                    { error: "Missing script ID in route" },
                    { status: 400 }
                );
            }

            // 3. FETCH FULL SCRIPT
            const { data: script, error: scriprErr } = await supabase
                .from("dynscripts")
                .select("*")
                .eq("id", scriptId)
                .single();

            if (scriprErr || !script) {
                return NextResponse.json(
                    { error: "Script not found" },
                    { status: 404 }
                );
            }

            // 4. ADMIN OVERRIDE
            if (options.adminOverride) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", userId)
                    .single();

                if (profile?.role === "admin") {
                    return handler({ req, userId, scriptId, script, version, params });
                }
            }

            // 5. DEV OVERRIDE
            const DEV_ID = process.env.DEV_FAKE_USER_ID;
            if (process.env.NODE_ENV === "development" && userId === DEV_ID) {
                return handler({ req, userId, scriptId, script, version, params });
            }

            // 6. OWNER CHECK
            if (script.owner_id !== userId) {
                return NextResponse.json(
                    { error: "Forbidden - You do not own this script", userId},
                    { status: 403 }
                );
            }

            // 7. PASS VALUE TO HANDLER
            return handler({ req, userId, scriptId, script, version, params });
        } catch (err) {
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}