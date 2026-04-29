import Image from "next/image";
import dynamoImage from "@/public/dynamo.png";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import { Metadata } from "next";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle } from "lucide-react";
import LikeButton from "@/app/components/LikeButton";
import DownloadButton from "@/app/components/DownloadButton";
import SVGCanvasD3 from "@/app/components/svg/SvgCanvasD3";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaPython } from "react-icons/fa6";
import CodeBlock from "@/app/components/CodeBlock";
import CommentForm from "@/app/components/CommentForm";
import VersionSheet from "@/app/components/scripts/VersionSheet";
import { auth } from "@clerk/nextjs/server";
import { getScriptBySlug, getScriptSlugs, pythonScriptsByVersionId, scriptLikedByUserId } from "@/lib/services/scripts.service";
import { ScriptSlug } from "@/app/lib/interface";
import { ApiError } from "@/lib/api/errors";
import { notFound, redirect } from "next/navigation";
import { handleApiError } from "@/lib/api/responses";


const DEV_BYPASS = process.env.NODE_ENV === "development";
const DEV_USER_ID = process.env.DEV_FAKE_USER_ID as string ?? "dev-user";

interface ScriptPageProps {
    params: Promise<{ slug: string}>;
}

async function getCurrentUserId(): Promise<string | null> {
    if (DEV_BYPASS && DEV_USER_ID) {
        return DEV_USER_ID;
    }
    
    const { userId } = await auth();

    return userId ?? null;
}

export async function generateStaticParams() {
    const slugs: ScriptSlug[] = await getScriptSlugs();

    return slugs?.map((s) => ({
        slug: s.slug,
    }));
}

async function getScriptOrHandle(slug: string, userId: string | null) {
    const res = await getScriptBySlug(slug, userId);


    if (res instanceof ApiError) {
        if (res.status === 404){
            notFound();
        }

        if (res.status === 401) {
            redirect(`/sign-in?redirect_url=/resources/dynamo-scripts/${slug}`);
        }

        if (res.status === 403) {
            return null;
        }
    }

    return res;
}
export async function generateMetadata({ params }: ScriptPageProps): Promise<Metadata> {
    const scriptParams = await params;
    
    const userId = await getCurrentUserId();

    try {
        const script = await getScriptBySlug(scriptParams.slug, userId);

        return {
            title: `${script.title} | Free Dynamo Scripts | BIMformative`,
            description: script.description ?? "Dynamo Script on BIMformative",
            keywords: `free dynamo scripts, dynamo revit, dynamo automation, BIM scripts, Revit scripts, Civil 3D scripts, ${script.tags ? script.tags.join(", "): ""}` ,
            robots: script.is_public ? "index, follow" : "noindex, nofollow",
            openGraph: {
                images: {
                    url: "https://www.bimformative.com/dynamo.png"
                },
                url: script.dyn_file_url,
                description: `Get ${script.title} for free. Perfect for Dynamo and ${script.script_type} workflows.`

            }
        }
    } catch {
        return {
            title: "Script not available | BIMformative",
            robots: "noindex, nofollow",
        };
    }    
}

export default async function ScriptDetailsPage({ params }: ScriptPageProps) {
    const currentUserId = await getCurrentUserId();
    const scriptParam = await params;

    const dynScript = await getScriptOrHandle(scriptParam.slug, currentUserId);

    console.log(dynScript.code);

    if (!dynScript) {
        return (
            <div className="min-h-[600px] flex items-center justify-center px-6">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <CardTitle>Private script</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            You do not have permission to view this script.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const likedByUser = currentUserId
        ? await scriptLikedByUserId(currentUserId, dynScript.id)
        : false;

    const imageMapping: any = {
        revit: { src: revitImage, alt: "Revit" },
        civil3d: { src: civil3dImage, alt: "Civil 3D" },
    };

    const scriptTypeImg = imageMapping[dynScript.script_type?.toLowerCase()?.replace(/\s/g, "")];

    const nodes = dynScript.nodes ? dynScript.nodes: [];
    const connectors = dynScript.connectors ? dynScript.connectors : [];
    
    const versionId = dynScript.version_id;
    
    const pyNodes = versionId
        ? await pythonScriptsByVersionId(versionId)
        : [];

    return (
        <main className="mx-auto max-w-7xl px-4 py.-8 md:px-8">
            {/* Header */}
            <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                            <Image src={dynamoImage} alt="Dynamo" className="h-7 w-7" />
                        </div>

                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">V{dynScript.version_number}</Badge>
                                {dynScript.script_type && (
                                    <Badge variant="outline">{dynScript.script_type}</Badge>
                                )}
                                {dynScript.is_player_ready && (
                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                                        Player Ready
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                {dynScript.title}
                            </h1>

                            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                                {dynScript.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <VersionSheet
                            title={dynScript.title}
                            scriptId={dynScript.id}
                            currentVersionNumber={dynScript.version_number}
                            scriptOwnerId={dynScript.owner_id}
                            currentUserId={currentUserId}
                            variant="button"
                        />

                        <LikeButton
                            variant="full"
                            scriptId={dynScript.id}
                            likesCount={dynScript.likes_count}
                            likedByUser={likedByUser}
                            userId={currentUserId}
                        />

                        <DownloadButton
                            userId={currentUserId}
                            slug={dynScript.slug}
                            downloadsCount={dynScript.downloads_count}
                            variant="full"
                        />
                    </div>
                </div>                
            </section>

            {/* Main Layout */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Canvas / Preview */}
                <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm lg:col-span-8 xl:col-span-9">
                    <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-lg">Graph Preview</CardTitle>
                    </CardHeader>

                    <CardContent className="flex min-h-[620px] items-center justify-center p-4">
                        {nodes?.length > 0 ? (
                            <div className="h-full w-full overflow-auto rounded-xl border boder-white/10 bg-slate-950/40">
                                <SVGCanvasD3
                                    nodes={nodes}
                                    connectors={connectors}
                                    canvasWidth={1200}
                                    canvasHeight={650}
                                />
                            </div>

                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p className="text-lg font-medium">No graph preview available</p>
                                <p className="mt-2 text-sm">
                                    This script does not include visual graph data yet.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Details */}
                <aside className="space-y-6 lg:col-span-4 xl:col-span-3">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Script Details</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <InfoSection title="Author">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={dynScript.owner_avatar_url} />
                                        <AvatarFallback>
                                            {String(dynScript.owner_first_name || "?")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {dynScript.owner_first_name} {dynScript.owner_last_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Script Creator</p>
                                    </div>
                                </div>
                            </InfoSection>

                            <InfoSection title="Platform">
                                <div className="flex items-center gap-2">
                                    {scriptTypeImg && (
                                        <Image
                                            src={scriptTypeImg.src}
                                            alt={scriptTypeImg.alt}
                                            className="h-6 w-6"
                                        />
                                    )}
                                    <span className="text-sm">{dynScript.script_type}</span>
                                </div>
                            </InfoSection>

                            <InfoSection title="Dynamo Version">
                                <span>{dynScript.dynamo_version || "Not specified"}</span>
                            </InfoSection>

                            <InfoSection title="Dynamo Player">
                                <div className="flex items-center gap-2">
                                    {dynScript.is_player_ready ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Ready</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">Not Ready</span>
                                        </>
                                    )}

                                </div>
                            </InfoSection>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {dynScript.tags?.length > 0 ? (
                                    dynScript.tags.map((tag: string, i: number) => (
                                        <Badge key={i} variant="default">
                                            {tag}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No tags added.</p>   
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Python Nodes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pyNodes.length > 0 ? (
                                <div className="space-y-2">
                                    {pyNodes.map((p:any, i: number) => (
                                        <Dialog key={i}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full justify-start">
                                                    <FaPython className="mr-2 h-4 w-4" />
                                                    Python Node {p.order_index + 1}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[80vh] max-w-7xl border-white/10 bg-background">
                                                <DialogTitle>Python Node {p.order_index + 1}</DialogTitle>
                                                <CodeBlock
                                                    language="python"
                                                    code={p.python_code}
                                                    title={p.order_index + 1}
                                                    />
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No Python nodes found.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className=" border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">External Packages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {dynScript.external_packages?.length > 0 ? (
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {dynScript.external_packages.map((pkg: string, i: number) => (
                                        <li key={i} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                                            {pkg}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No external packages used.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>        
    );
}

function InfoSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {title}
            </h4>
            <div>{children}</div>
        </div>
    );
}