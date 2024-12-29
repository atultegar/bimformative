"use client";
import { Charm } from "next/font/google";
import { PageBanner } from "../components/PageBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { DataTable } from "../resources/dynamo-scripts/data-table";
import { columns } from "../resources/dynamo-scripts/columns";
import BlogPostCard from "../components/BlogPostCard";
import { OtherDataTable } from "../resources/other-assets/other-data-table";
import { othercolumns } from "../resources/other-assets/other-columns";
import { set } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { YouTubePlayer } from "../components/YouTubePlayer";
import Link from "next/link";
import Image from "next/image";
import { SiGitbook } from "react-icons/si";
import { codeSnippet, DocsCard, simpleBlogCard, videoTutorial } from "../lib/interface";
import { useRouter, useSearchParams } from "next/navigation";
import searchCover from "@/public/search-cover.png";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CodeBlock from "../components/CodeBlock";
import { TbBrandCSharp, TbBrandPython } from "react-icons/tb";

const charm = Charm({ weight: "700", subsets: ["latin"]});

async function fetchResources(query: string) {
    try {
        const response = await fetch(`/api/resources?query=${query}&limit=100`);
        if (!response.ok) {
            throw new Error("Failed to fetch resources");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in fetchResources:", error);
        return null;
    }
}

import { Suspense } from "react";

export default function Resources() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResourcesContent />
        </Suspense>
    );
}

function ResourcesContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (query) {
            setSearchTerm(query);
            setTempSearchTerm(query);
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            router.push(`/search?q=${tempSearchTerm}`);
            setSearchTerm(tempSearchTerm);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?q=${tempSearchTerm}`);
        setSearchTerm(tempSearchTerm);
    };

    const [counts, setCounts] = useState({
        blogCount: 0,
        dynamoScriptCount: 0,
        codeSnippetCount: 0,
        docCount: 0,
        tutorialCount: 0,
        otherAssetCount: 0,
    });

    useEffect(() => {
        async function updateCounts() {
            if (searchTerm) {
                const resources = await fetchResources(searchTerm);
                if (resources) {
                    const counts = {
                        blogCount: 0,
                        dynamoScriptCount: 0,
                        codeSnippetCount: 0,
                        docCount: 0,
                        tutorialCount: 0,
                        otherAssetCount: 0,
                    };

                    resources.result.forEach((resource: any) => {
                        switch (resource._type) {
                            case "blog":
                                counts.blogCount++;
                                break;
                            case "dynamoscript":
                                counts.dynamoScriptCount++;
                                break;
                            case "codeSnippet":
                                counts.codeSnippetCount++;
                                break;
                            case "docs":
                                counts.docCount++;
                                break;
                            case "videoTutorial":
                                counts.tutorialCount++;
                                break;
                            case "otherassets":
                                counts.otherAssetCount++;
                                break;
                            default:
                                break;
                        }
                    });

                    setCounts(counts);
                }
            }
        }
        updateCounts();
    }, [searchTerm]);

    const [blogData, setBlogData] = useState<simpleBlogCard[]>([]);
    const [dynamoScriptData, setDynamoScriptData] = useState([]);
    const [codeSnippetData, setCodeSnippetData] = useState<codeSnippet[]>([]);
    const [otherAssetsData, setOtherAssetsData] = useState([]);
    const [videoTutorialsData, setVideoTutorialsData] = useState<videoTutorial[]>([]);
    const [docsData, setDocsData] = useState<DocsCard[]>([]);

    useEffect(() => {
        async function updateResources() {
            if (searchTerm) {
                const resources = await fetchResources(searchTerm);
                if (resources) {
                    const blogPosts = resources.result.filter((resource: any) => resource._type === "blog");
                    setBlogData(blogPosts);
                    const dynamoScripts = resources.result.filter((resource: any) => resource._type === "dynamoscript");
                    setDynamoScriptData(dynamoScripts);
                    const codeSnippets = resources.result.filter((resource: any) => resource._type === "codeSnippet");
                    setCodeSnippetData(codeSnippets);
                    const otherAssets = resources.result.filter((resource: any) => resource._type === "otherassets");
                    setOtherAssetsData(otherAssets);
                    const videoTutorials = resources.result.filter((resource: any) => resource._type === "videoTutorial");
                    setVideoTutorialsData(videoTutorials);
                    const docs = resources.result.filter((resource: any) => resource._type === "docs");
                    setDocsData(docs);
                }
            }
        }
        updateResources();
    }, [searchTerm]);

    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px] items-center justify-center">
            <PageBanner imageSrc={searchCover} title="Search" description="Search resources" />
            <div className="flex items-center justify-center">
                <form
                    className="mt-10 relative flex w-full max-w-sm sm:max-w-xl items-center justify-center space-x-2 border dark:border-gray-500 rounded-2xl hover:border-gray-900 bg-white dark:bg-gray-950 p-1 dark:hover:border-blue-800"
                    onSubmit={handleSubmit}
                >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-6 h-6 text-gray-500" />
                    </span>
                    <Input
                        type="search"
                        placeholder="Find the BIM resource you need..."
                        value={tempSearchTerm}
                        onChange={(e) => setTempSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-10 border-none focus:outline-none focus:ring-0 bg-transparent text-gray-500"
                    />
                    <span>
                        <Button type="submit" variant="default" className="p-2 rounded-xl w-24">
                            Search
                        </Button>
                    </span>
                </form>
                <p>{}</p>
            </div>

            {/* Tab Blogs  */}
            <Tabs defaultValue="blogs" className="w-full mt-10">
                <TabsList>
                    <TabsTrigger value="blogs">Blogs ({counts.blogCount})</TabsTrigger>
                    <TabsTrigger value="dynamoscripts">Dynamo Scripts ({counts.dynamoScriptCount})</TabsTrigger>
                    <TabsTrigger value="codesnippets">Code Snippets ({counts.codeSnippetCount})</TabsTrigger>
                    <TabsTrigger value="videotutorial">Video Tutorials ({counts.tutorialCount})</TabsTrigger>
                    <TabsTrigger value="otherassets">Other Assets ({counts.otherAssetCount})</TabsTrigger>
                    <TabsTrigger value="docs">Documentations ({counts.docCount})</TabsTrigger>
                </TabsList>
                <TabsContent value="blogs">
                    <div className="mt-0 mb-16 p-5 grid grid-cols-1 gap-y-20 md:grid-cols-3 md:gap-x-16 md:gap-y-20 lg:gap-x-10 content-center bg-muted rounded-md">
                        {blogData.map((post, idx) => (
                            <BlogPostCard key={idx} post={post} idx={idx} />
                        ))}
                    </div>
                </TabsContent>

                {/* Tab Dynamo Scripts  */}
                <TabsContent value="dynamoscripts">
                    <div className="container max-w-[1280px] mx-auto py-10">
                        <DataTable columns={columns} data={dynamoScriptData} />
                    </div>
                </TabsContent>

                {/* Tab Code Snippets  */}
                <TabsContent value="codesnippets">
                    <div className="mt-0 mb-16 p-5 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10 lg:gap-x-10 content-center bg-muted rounded-md">
                        {codeSnippetData.map((item, index) => (
                            <article key={index}>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="group relative mx-auto">
                                            <div className="d-block w-full h-[75px] ring-1 ring-gray-900/5 border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white dark:bg-stone-950 content-center rounded-lg hover:bg-gray-100 hover:dark:bg-gray-800 cursor-pointer hover:text-primary">
                                                <h3 className="text-balance text-lg ml-5 font-semibold leading-snug">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-6xl">
                                        <DialogHeader>
                                            <DialogTitle>{item.title}</DialogTitle>
                                            <DialogDescription className="mt-2">
                                                <CodeBlock language={item.codeField.language} code={item.codeField.code} />
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </article>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab Video Tutorials */}
                <TabsContent value="videotutorial">
                    <div className="container max-w-[1280px] mx-auto p-5 mt-0 mb-16 flex flex-col bg-muted rounded-md gap-y-5">
                        {videoTutorialsData.map((item, idx) => (
                            <div key={idx}>
                                <Card className="relative block w-full bg-gray-100 dark:bg-black mb-0">
                                    <CardContent className="flex flex-col overflow-hidden rounded-none p-4 lg:flex-row">
                                        <div className="inline-block w-full lg:rounded overflow-hidden h-full cursor-pointer border border-gray-200 dark:border-gray-700">
                                            <YouTubePlayer url={`https://www.youtube.com/watch?v=${item.youtube}`} />
                                        </div>
                                        <div className="w-full p-6 lg:w-3/5">
                                            <h2 className="font-bold text-3xl">{item.name}</h2>
                                            <p className="mt-2 text-gray-700 dark:text-gray-300">{item.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab Other Assets */}
                <TabsContent value="otherassets">
                    <div className="container max-w-[1280px] mx-auto py-10">
                        <OtherDataTable columns={othercolumns} data={otherAssetsData} />
                    </div>
                </TabsContent>

                {/* Tab Docs */}
                <TabsContent value="docs">
                    <div className="container max-w-[1280px] mx-auto p-5 mt-0 mb-16 flex flex-col bg-muted rounded-md gap-y-5">
                        {docsData.map((item, idx) => (
                            <div key={idx}>
                                <Card className="bg-gray-100 dark:bg-black mb-0">
                                    <CardContent className="w-full p-10 grid grid-cols-1 md:grid-cols-2 mx-auto gap-4">
                                        <Link href={item.url}>
                                            <div className="md:col-start-2 col-start-1 mt-10 md:mt-0 d-block w-full h-[200px] md:h-[300px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white content-center">
                                                <Image src={item.imageUrl} alt="image" fill={true} className="mx-auto object-contain hover:opacity-50" />
                                            </div>
                                        </Link>
                                        <div className="flex flex-col h-[300px] justify-center items-end gap-14">
                                            <Link href={item.url}>
                                                <div className="font-bold text-3xl md:w-[400px] w-[300px] hover:underline text-right">
                                                    {item.name}
                                                </div>
                                            </Link>
                                            <div className="md:w-[400px] w-[300px] text-right">
                                                {item.description}
                                            </div>
                                            <Button className="w-40" asChild>
                                                <Link href={item.url} className="hover:underline">
                                                    <SiGitbook /> Link
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
}