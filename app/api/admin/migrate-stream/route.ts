import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/lib/sanity";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

async function isAuthorized(req: Request) {
    try {
        const clerkUser = await currentUser();
        const userId = process.env.NODE_ENV === "development"
                ? process.env.DEV_FAKE_USER_ID // mock user in dev
                : clerkUser?.id;

        if (userId) return true;
    } catch (e) {
        return false
    }    
}

function sseEvent(data: any, event = "message") {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function createNodeFile(buffer: Buffer, filename: string) {
    // convert Node Buffer to Uint8Array so it's a valid BlobPart (ArrayBufferView)
    const uint8 = new Uint8Array(buffer);
    return new File([uint8], filename, {
        type: "application/octet-stream",
    });
}

export async function GET(req: Request) {
    if(!isAuthorized(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SSE response stream
    const stream = new ReadableStream({
        async start(controller) {
            const push = (msg: any, ev = "message") => controller.enqueue(sseEvent(msg, ev));
            
            try {
                push({ msg: "Starting migration..." }, "start");

                // fetch all dynamo scripts from sanity
                push({ msg: "Querying Sanity for scripts..." });
                const query = `*[_type == "dynamoscript"]{
                    _id,
                    title,
                    description,
                    tags,
                    "fileUrl": scriptfile.asset->url,
                    "fileName": scriptfile.asset->originalFilename
                    }`;

                const scripts: any[] = await client.fetch(query);

                push({ msg: `Found ${scripts.length} scripts.` });
                const supabase = supabaseServer();

                const { data: existingScripts } = await supabase.from("dynscripts").select("slug, title");
                const existingSet = new Set((existingScripts ?? []).map((r: any) => r.slug || r.title));

                let migrated = 0;
                let skipped = 0;
                let idx = 0;

                for (const script of scripts) {
                    idx++;
                    push({ msg: `(${idx}/${scripts.length}) Processing: ${script.title}` });

                    // skip if already present in Supbase by slug/title
                    const slugKey = (script.fileName ?? script.title ?? "").replace(/\.[^.]+$/, "");
                    if (existingSet.has(slugKey) || existingSet.has(script.title)) {
                        push({ msg: `Skipping (already exists): ${script.title}` }, "skip");
                        skipped++;
                        continue;
                    }

                    // fetch file bytes
                    push({ msg: `Downloading file from Sanity: ${script.fileUrl}` });
                    const fileResp = await fetch(script.fileUrl);
                    if (!fileResp.ok) {
                        push({ msg: `Failed to download file: ${script.fileUrl}` }, "error");
                        skipped++;
                        continue;
                    }
                    const arrayBuffer = await fileResp.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const file = createNodeFile(buffer, script.fileBuffer || "script.dyn");

                    // call analyze API - uses your middleware, so pass dev key or rely on Clerk auth
                    push({ msg: `Calling Analyze API...` });
                    // We POST file buffer as form data to /api/scripts/analyze
                    const analyzeForm = new FormData();
                    analyzeForm.append("file", file);

                    const analyzeRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/scripts/analyze`, {
                        method: "POST",
                        headers: { "x-api-key": API_KEY },
                        body: analyzeForm,
                    });

                    if (!analyzeRes.ok) {
                        const body = await analyzeRes.text();
                        push({ msg: `Analyze failed: ${body}` }, "error");
                        skipped++
                        continue;
                    }
                    const analyzeJson = await analyzeRes.json();
                    const parsedJson = analyzeJson.scriptData;

                    // Now call publish API
                    push({ msg: `Calling Publish API...` });
                    const pubForm = new FormData();
                    pubForm.append("file", file);
                    pubForm.append("title", script.title || script.fileName);
                    pubForm.append("description", script.description || "");
                    pubForm.append("tags", JSON.stringify(script.tags ?? []));
                    pubForm.append("parsedJson", JSON.stringify(parsedJson));

                    const publishRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/scripts/publish`, {
                        method: "POST",
                        headers: { "x-api-key": API_KEY },
                        body: pubForm,
                    })

                    if (!publishRes.ok) {
                        const body = await publishRes.text();
                        push({ msg: `Publish failed: ${body}` }, "error" );
                        skipped++;
                        continue;
                    }

                    const publishJson = await publishRes.json();
                    push({ msg: `Published: ${publishJson.script} v${publishJson.version || "?"}`}, "success");

                    // optional: mark slug in existingSet to avoid duplicates in the same run
                    existingSet.add(slugKey);
                    migrated++                    
                }

                push({ msg: `Migration complete: migrated=${migrated}, skipped=${skipped}` }, "done");
                controller.close();

            } catch (err: any) {
                controller.enqueue(sseEvent({ msg: `Migration aborted: ${err.message || String(err)}` }, "error"));
                controller.close();
            }
        },
        cancel(reason) {
            // client closed the connection
            // nothing to do; but you can log if needed
            
        },
    });

    console.log("something happened");

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}