import { supabaseServer } from "@/lib/supabase/server";

export type DesktopAuthStatus = "pending" | "approved" | "expired";

export interface DesktopAuthSession {
    id: string;
    status: DesktopAuthStatus;
    token: string | null;
    created_at: string;
}

const TABLE = "desktop_auth_sessions";

// Create a new desktop auth session
export async function createSession(sessionId: string) {
    const supabase = supabaseServer();

    const { error } = await supabase.from(TABLE).insert({
        id: sessionId,
        status: "pending",
        token: null,
    });

    if (error) {
        throw new Error(`CREATE_SESSION_FAILED: ${error.message}`);
    }
}

// Approve session and attach token (called after Clerk login)
export async function approveSession(sessionId: string, token: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from(TABLE)
        .update({
            status: "approved",
            token,
        })
        .eq("id", sessionId)
        .select()
        .single();

    if (error || !data) {
        throw new Error("SESSION_NOT_FOUND");
    }

    return data as DesktopAuthSession;
}

// Get session (used by polling)
export async function getSession(sessionId: string) {
    const supabase = supabaseServer();

    const { data } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();

    return data as DesktopAuthSession | null;
}

// Delete session (one-time token read)
export async function deleteSession(sessionId: string) {
    const supabase = supabaseServer();
    await supabase.from(TABLE).delete().eq("id", sessionId);
}