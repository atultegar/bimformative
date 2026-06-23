import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getToolBySlug } from "@/lib/services/tools.service";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FaGithub, FaGlobe } from "react-icons/fa6";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { ToolDownloadButton } from "@/app/components/ToolDownloadButton";
import { formatDistanceToNow } from "date-fns";
import { date } from "zod";

interface Props {
    params: Promise<{ slug: string}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const {slug } = await params;

    try {
        const tool = await getToolBySlug(slug);

        return {
            title: `${tool.name} | BIMformative Tools`,
            description: tool.short_description,
            openGraph: {
                title: tool.name,
                description: tool.short_description
            }
        };
    } catch {
        return {
            title: "Tool not found | BIMformative"
        };
    }
}

export default async function ToolDetailPage({ params }: Props) {
    const { slug } = await params;

    let tool;

    try {
        tool = await getToolBySlug(slug);
    } catch {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

            {/* HEADER */}
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    {/* {tool.logo_url && (
                        <Image
                            src={tool.logo_url}
                            alt={tool.name}
                            width={64}
                            height={64}
                            className="rounded-lg" 
                        />
                    )} */}
                    <div>
                        <h1 className="text-4xl font-bold text-primary">
                            {tool.name}
                        </h1>

                        <p className="mt-6 text-muted-foreground text-lg">
                            {tool.short_description}
                        </p>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 flex-wrap">
                {tool.github_url && (
                    <Button variant="outline" asChild>
                        <Link href={tool.github_url}>
                            <FaGithub />
                            GitHub
                        </Link>
                    </Button>
                )}

                {tool.documentation_url && (
                    <Button variant="secondary" asChild>
                        <Link href={tool.documentation_url}>
                            Documentation
                        </Link>
                    </Button>
                )}

                {tool.website_url && (
                    <Button variant="secondary" asChild>
                        <Link href={tool.website_url}>
                            <FaGlobe />
                            Website
                        </Link>
                    </Button>
                )}
            </div>

            <Separator />

            {/* OVERVIEW */}
            <Card className="dark:bg-white/5 backdrop-blur-sm dark:border-white/10">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none text-muted-foreground">
                    <p>{tool.description}</p>
                </CardContent>
            </Card>

            {/* Features */}
            {tool.features?.length > 0 && (
                <Card className="dark:bg-white/5 backdrop-blur-sm dark:border-white/10">
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <ul className="list-disc pl-6 space-y-2">
                            {tool.features.map((f: string, i: number) => (
                                <li key={i}>{f}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Releases */}
            <Card className="dark:bg-white/5 backdrop-blur-sm dark:border-white/10">
                <CardHeader>
                    <CardTitle>
                        Downloads
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {tool.tool_variants
                        ?.sort(
                            (a: any, b: any) =>
                                Number(b.host_version) -
                                Number(a.host_version)
                        )
                        .map((variant: any) => {
                            const latest =
                                variant.tool_releases?.find(
                                    (r: any) => r.is_latest
                                ) ??
                                variant.tool_releases?.[0];

                            return (
                                <Card
                                    key={variant.id}
                                    className="border"
                                >
                                    <CardContent className="p-6">

                                        <div className="flex justify-between items-start">

                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {variant.name}
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    {variant.host_application} {variant.host_version}
                                                </p>

                                                {latest && (
                                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                                                        <Badge>
                                                            Latest
                                                        </Badge>

                                                        <Badge variant="outline">
                                                            v{latest.version}
                                                        </Badge>

                                                        <Badge variant="secondary">
                                                            {latest.download_count.toLocaleString()} downloads
                                                        </Badge>

                                                        <span className="text-muted-foreground">
                                                            Published{" "}
                                                            {formatDistanceToNow(new Date(latest.published_at), { addSuffix: true})}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {latest && (                                                
                                                <ToolDownloadButton releaseId={latest.id} size="sm" />
                                            )}
                                        </div>

                                        <Collapsible className="mt-4 data-[state=open]:bg-transparent">

                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="group"
                                                >
                                                    Previous Versions
                                                    <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" /> 
                                                </Button>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <div className="mt-3 border rounded-md divide-y">

                                                    {variant.tool_releases
                                                        ?.sort(
                                                            (a: any, b: any) =>
                                                                b.version.localeCompare(a.version)
                                                        )
                                                        .map((release: any) => (
                                                            <div key={release.id} className="flex justify-between items-center p-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">
                                                                            v{release.version}
                                                                        </span>

                                                                        {release.is_latest && (
                                                                            <Badge>
                                                                                Latest
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                                        <Badge variant="secondary">
                                                                            {release.download_count ?? 0} downloads
                                                                        </Badge>

                                                                        {release.published_at && (
                                                                            <span>
                                                                                Published{" "}
                                                                                {formatDistanceToNow(new Date(release.published_at),
                                                                                    {
                                                                                        addSuffix: true,
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    
                                                                </div>
                                                                <ToolDownloadButton releaseId={release.id} variant="outline" size="sm" />
                                                            </div>
                                                        )
                                                        )}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>

                                    </CardContent>
                                </Card>
                            );
                        })}
                </CardContent>
            </Card>

            {/* Screenshots */}
            {tool.screenshots?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Screenshots</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.screenshots.map((img: string, i: number) => (
                            <div key={i} className="relative h-64 border rounded overflow-hidden">
                                <Image
                                    src={img}
                                    alt="screenshot"
                                    fill
                                    className="object-cover"     
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

        </div>
    )
}