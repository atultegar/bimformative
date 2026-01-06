"use client";

import { useEffect, useState } from "react";
import { VersionTable } from "./version-table";
import { getScriptVersionsAction } from "@/app/actions/serverActions";
import { MinimalVersion } from "@/lib/types/version";

export function VersionSheetContent({ title, scriptId, currentUserId, canManageVersions }: { title: string, scriptId: string, currentUserId: string | null, canManageVersions: boolean }) {
    const [versions, setVersions] = useState<MinimalVersion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getScriptVersionsAction(scriptId);

                setVersions(data);
            } catch (err) {
                console.error("Failed to load versions:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [scriptId]);

    if (loading) return <p className="py-4">Loading...</p>

    return <VersionTable title={title} versions={versions} currentUserId={currentUserId} canManageVersions={canManageVersions} />;
}