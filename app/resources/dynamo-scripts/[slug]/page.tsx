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
import ClientVersionSheet from "@/app/components/scripts/ClientVersionSheet";
import { auth } from "@clerk/nextjs/server";
import { getScriptBySlug, getScriptSlugs, pythonScriptsByVersionId, scriptLikedByUserId } from "@/lib/services/scripts.service";


const DEV_BYPASS = process.env.NODE_ENV === "development";
const DEV_USER_ID = process.env.DEV_FAKE_USER_ID as string ?? "dev-user";

async function getCurrentUserId(): Promise<string> {
    if (DEV_BYPASS) {
        return DEV_USER_ID;
    }

    const { userId } = await auth();
    if (!userId) {
        return "guest";
    }
    return userId;
}

export async function generateStaticParams() {
    const slugs = await getScriptSlugs();

    return slugs?.map((s) => ({
        slug: s.slug,
    }));
}
''
export async function generateMetadata({ params }: { params: { slug: string }}): Promise<Metadata> {
    const scriptParams = await params;
    
    const userId = await getCurrentUserId();
    const script = await getScriptBySlug(scriptParams.slug, userId);

    return {
        title: `${script.title} | Free Dynamo Scripts | BIMformative`,
        description: script.description ?? "Dynamo Script on BIMformative",
        keywords: `free dynamo scripts, dynamo revit, dynamo automation, BIM scripts, Revit scripts, Civil 3D scripts, ${script.tags ? script.tags.join(", "): ""}` ,
        robots: "index, follow",
        openGraph: {
            images: {
                url: "https://www.bimformative.com/dynamo.png"
            },
            url: script.dyn_file_url,
            description: `Get ${script.title} for free. Perfect for Dynamo and ${script.script_type} workflows.`

        }
    }
}

export default async function ScriptDetailsPage({ params }: { params: { slug: string}}) {
    const currentUserId = await getCurrentUserId();
    const scriptParam = await params;
    const dynScript  = await getScriptBySlug(scriptParam.slug, currentUserId);
    const likedByUser = await scriptLikedByUserId(currentUserId, dynScript.id);

    const imageMapping: any = {
        revit: { src: revitImage, alt: "Revit" },
        civil3d: { src: civil3dImage, alt: "Civil 3D" },
    };

    const scriptTypeImg = imageMapping[dynScript.script_type?.toLowerCase()?.replace(/\s/g, "")];

    const nodes = dynScript.nodes ? dynScript.nodes: [];
    const connectors = dynScript.connectors ? dynScript.connectors : [];
    
    const versionId = dynScript.version_id;
    
    const pyRes = await pythonScriptsByVersionId(versionId);

    const pyNodes = pyRes ?? null;

    return (
        <div className="mx-auto w-[1920px] items-center">
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 py-10 bg-gray-100 dark:bg-black">

                {/* LEFT SIDEBAR */}
                <Card className="md:col-span-4 lg:col-span-3 h-[800px] sticky top-6 shadow-md border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Image src={dynamoImage} alt="Dynamo" className="w-8 h-8" />
                            <CardTitle className="text-xl font-semibold leading-tight">
                                {dynScript.title}                                                               
                            </CardTitle>
                            <ClientVersionSheet
                                title={dynScript.title}
                                scriptId={dynScript.id}
                                currentVersionNumber={dynScript.version_number}
                                scriptOwnerId={dynScript.owner_id}
                                currentUserId={currentUserId} 
                            />                   
                        </div>
                        
                        {/* <CardDescription>{dynScript.description}</CardDescription> */}
                    </CardHeader>

                    <CardContent>
                        <ScrollArea className="h-[620px] pr-4">
                            {/* Description */}
                            <Section title="Description">
                                <p>{dynScript.description}</p>
                            </Section>
                            {/* Tags */}
                            <Section title="Tags">
                                <div className="flex flex-wrap gap-2">
                                    {dynScript.tags?.length > 0 ? (
                                        dynScript.tags.map((tag: string, i: number) => (
                                            <Badge key={i} variant="secondary">{tag}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No tags added.</p>
                                    )}
                                </div>
                            </Section>                        

                            {/* Script Type */}
                            <Section title="Script Type">
                                <div className="flex items-center gap-2">
                                    {scriptTypeImg && (
                                        <Image src={scriptTypeImg.src} alt={scriptTypeImg.alt} className="w-7 h-7" />
                                    )}
                                    <span>{dynScript.script_type}</span>
                                </div>
                            </Section>

                            {/* Author */}
                            <Section title="Author">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={dynScript.owner_avatar_url} />
                                        <AvatarFallback>
                                            {String(dynScript.owner_first_name || "?").slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{dynScript.owner_first_name} {dynScript.owner_last_name}</span>
                                </div>
                            </Section>

                            {/* Dynamo Version */}
                            <Section title="Dynamo Version">
                                <span>{dynScript.dynamo_version}</span>
                            </Section>

                            {/* Player Ready */}
                            <Section title="Dynamo Player Ready">
                                {dynScript.is_player_ready ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                            </Section>

                            {/* Python Nodes */}
                            <Section title="Python Nodes">
                                <div className="flex flex-col place-items-start gap-2">
                                    {pyNodes.length > 0 ? (
                                        pyNodes.map((p:any, i: number) => (
                                            <div key={i}>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button>
                                                            <FaPython className="w-6 h-6" />
                                                            Python Node - {p.order_index + 1}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-7xl max-h-[80vh] bg-transparent border-none">
                                                        <DialogTitle></DialogTitle>
                                                        <CodeBlock language="python" code={p.python_code} title={p.order_index + 1} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            
                                        ))
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            </Section>

                            {/* External Packages */}
                            <Section title="External Packages">
                                {dynScript.external_packages?.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {dynScript.external_packages.map((pkg: string, i: number) => (
                                            <li key={i}>{pkg}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">No external packages used.</p>
                                )}
                            </Section>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between px-6 py-4">
                        <LikeButton variant="full" scriptId={dynScript.id} likesCount={dynScript.likes_count} likedByUser={likedByUser} userId={currentUserId} />
                        <DownloadButton userId={currentUserId} slug={dynScript.slug} downloadsCount={dynScript.downloads_count} variant="full" />
                    </CardFooter>
                </Card>

                {/* RIGHT CANVAS PANEL */}
                <Card className="md:col-span-8 lg:col-span-9 h-[800px] shadow-md border">
                    <CardContent className="pt-6 flex justify-center items-center h-full">
                        {nodes?.length > 0 ? (
                            <SVGCanvasD3 
                                nodes={nodes}
                                connectors={connectors}
                                canvasWidth={1350}
                                canvasHeight={750}
                            />
                        ) : (
                            <p className="text-gray-400 text-lg">
                                No graph preview available.
                            </p>
                        )}
                    </CardContent>
                </Card>

            </section>
            <section className="px-6 bg-gray-100 dark:bg-black">
                <Card className="shadow-md border">
                    <CommentForm scriptId={dynScript.id} userId={currentUserId} />
                </Card>
            </section>
        </div>
        
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-1 text-gray-700">{title}</h4>
            <div className="text-sm">{children}</div>
        </div>
    );
}