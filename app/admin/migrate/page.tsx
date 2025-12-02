"use client";

import { ReactJsxRuntime } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";
import { Noto_Sans_Tamil_Supplement } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
export default function MigrationAdminPage() {
    const [running, setRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const evtRef = useRef<EventSource | null>(null);

    function append(msg: string) {
        setLogs((s) => [...s, msg].slice(-1000)); // Keep last 1000 lines        
    }

    function startMigration() {
        if (evtRef.current) return;

        setLogs([]);
        setRunning(true);

        const url = `/api/admin/migrate-stream?key=${process.env.NEXT_PUBLIC_API_KEY}`;

        const es = new EventSource(url);

        es.onopen = () => append("SSE connected. Migration starting...");
        es.onmessage = (e) => {
            try {
                const payload = JSON.parse(e.data);
                append(`[info] ${payload.msg}`);
            } catch {
                append(`[info] ${e.data}`)
            }
        };

        es.addEventListener("start", (ev: any) => {
            try {
                const d = JSON.parse(ev.data);
                append(`[start] ${d.msg}`);
            } catch {
                append(`[start] ${ev.data}`);
            }
        });

        es.addEventListener("success", (ev: any) => {
            try {
                const d = JSON.parse(ev.data);
                append(`[success] ${d.msg}`);
            } catch {
                append(`[success] ${ev.data}`);
            }
        });

        es.addEventListener("skip", (ev: any) => {
            try {
                const d = JSON.parse(ev.data);
                append(`[skip] ${d.msg}`);
            } catch {
                append(`[skip] ${ev.data}`);
            }
        });

        es.addEventListener("error", (ev: any) => {
            try {
                const d = JSON.parse(ev.data);
                append(`[error] try client ${d.msg}`);
            } catch {
                append(`[error] catch client ${ev.data}`);
            }
        });

        es.addEventListener("done", (ev: any) => {
            try {
                const d = JSON.parse(ev.data);
                append(`[done] ${d.msg}`);
            } catch {
                append(`[done] ${ev.data}`);
            }
            setRunning(false);
            es.close();
            evtRef.current = null;
        });

        es.onerror = (e) => {
            append("[error] SSE error; connection closed.");
            setRunning(false);
            es.close();
            evtRef.current = null;
        };

        evtRef.current = es;
    }

    function stopMigration() {
        if (evtRef.current) {
            evtRef.current.close();
            evtRef.current = null;
            setRunning(false);
            append("[info] Migration aborted by user.");
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sanity → Supabase Migration (Dynamo Scripts)</h1>

            <div className="flex gap-3 mb-4">
                <Button onClick={startMigration} disabled={running}>
                    {running ? "Running...": "Start Migration"}
                </Button>
                <Button variant={"ghost"} onClick={stopMigration} disabled={!running}>
                    Stop
                </Button>
            </div>

            <div className="border rounded p-3 h-[60vh] overflow-auto bg-black text-white">
                {logs.length === 0 ? (
                    <div className="text-gray-400">Logs will appear here...</div>
                ) : (
                    logs.map((l, i) => <div key={i}><code>{l}</code></div>)
                )}
            </div>
        </div>
    );
}