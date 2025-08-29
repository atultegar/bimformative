import { getDynScriptById, getDynScriptProps} from "@/app/lib/api";
import { dynamoscript } from "@/app/lib/interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckmarkCircleIcon, CloseCircleIcon } from "@sanity/icons";
import LikeButton from "@/app/components/LikeButton";
import DownloadButton from "@/app/components/DownloadButton";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import dynamoImage from "@/public/dynamo.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import SVGCanvasD3 from "@/app/components/svg/SvgCanvasD3";
import { Button } from "@/components/ui/button";
import { handleScriptDownload } from "@/app/actions/clientActions";
import { Separator } from "@/components/ui/separator";

interface DynamoScriptProps {
    params: Promise<{ id: string}>
}

const imageMapping: { [key: string]: {src: any, alt:string}} = {
    revit: {src: revitImage, alt: "Revit"},
    civil3d: {src: civil3dImage, alt: "Civil 3D"}
};

export async function generateMetadata({params}: DynamoScriptProps): Promise<Metadata> {
    const { id } = await params;
    const script: dynamoscript = await getDynScriptById(id);

    return {
        title: `${script.title} | Free Dynamo Scripts`,
        description: `Download ${script.title} for free. Explore more Dynamo scripts on BIMformative.`,
        keywords: `free dynamo scripts, dynamo revit, dynamo automation, BIM scripts, Revit scripts, Civil 3D scripts, ${script.tags ? script.tags.join(", "): ""}` ,
        robots: "index, follow",
        openGraph: {
            images: {
                url: "https://www.bimformative.com/dynamo.png"
            },
            url: script.fileUrl,
            description: `Get ${script.title} for free. Perfect for Dynamo and Revit workflows.`
        }
    }
}

export async function generateStaticParams() {
    const dynScripts = await getDynScriptProps();
    return dynScripts.map((script: { _id: string }) => ({
        slug: script._id,
    }))
}

export default async function ScriptDetailsPage({params}: DynamoScriptProps) {
    const { id } = await params;
    const script: dynamoscript = await getDynScriptById(id);
    let nodes: any[] = [];
    let connectors: any[] = [];

    if (!script) {
        return (
            <div>
                <p>Not Found</p>
            </div>
        )
    }

    if(script?.code){
        const parsedCode = JSON.parse(script?.code);
        nodes = parsedCode.Nodes ?? [];
        connectors = parsedCode.Connectors ?? [];
    }

    const scriptUrl = `https://bimformative.com/dynamo-script/${script._id}`;

    const scriptTypeImg = imageMapping[script.scripttype.toLowerCase().replace(/\s/g, "")] || null;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${script.title} | Free Dynamo Scripts`,
        "description": `Download ${script.title} for free. Explore more Dynamo scripts on BIMformative.`,
        "applicationCategory": "CAD/Engineering/BIM",
        "operatingSystem": "Windows",
        "softwareVersion": script.dynamoversion,
        "downloadUrl": script.fileUrl,
        "image": script.image ? script.image : "https://www.bimformative.com/dynamo.png",
        "author": {
            "@type": "Person",
            "name": script.author,
            "image": script.authorPicture
        },
        "datePublished": script._createdAt,
        "dateModified": script._updatedAt,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": script.likes ? script.likes.length : "0",
        },
        "interactionStatistics" : {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/LikeAction",
            "userInteractionCount": script.likes ? script.likes.length : "0",
        }
    };

    return (
        <section className="mt-8 w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 items-center justify-center">
            <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData)}}/>
            <Card className="col-span-3 h-[80vh]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image src={dynamoImage} alt="Dynamo" className="w-6 h-6" />
                            <h3 className="text-lg">{script.title}</h3>
                        </div>                                 
                        {/* <div className="flex items-center gap-5 mr-7">
                            <LikeButton script={script} />
                            <DownloadButton script={script} />                        
                        </div> */}
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] text-sm">
                        <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-4 mb-5">
                        <strong className="w-[150px]">Tags:</strong>
                        {script.tags && script.tags.length > 0 ? (
                            <ul className="mt-1 space-x-2 list-disc list-inside">
                                {script.tags.map((tag, index) => (
                                    <Badge key={index}>{tag}</Badge>
                                ))}
                            </ul>
                        ) : (
                            <h3 className="text-gray-500"></h3>
                        )}                        
                        </div>
                        <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-4 mb-5">
                            <strong className="w-[150px]">Script Type:</strong>
                            {scriptTypeImg ? (
                                <div className="flex flex-row items-center gap-1">
                                    <Image src={scriptTypeImg.src} alt={scriptTypeImg.alt} className="w-8 h-8" />
                                    <p>{script.scripttype}</p>
                                </div>
                            ) : (
                                <p>{script.scripttype}</p>
                            )}
                        </div>
                        
                        <div className="ml-2 mt-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <strong className="w-[150px]">Author:</strong>
                            <div className="flex flex-row items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={script.authorPicture}/>
                                <AvatarFallback>{String(script.author).slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                                {script.author}
                            </div>                    
                        </div>
                        <div className="ml-2 mb-5 flex flex-row w-full items-start justify-items-start gap-5">
                            <strong className="w-[150px]">Description:</strong>
                            <div className="font-light">
                                {script.description}
                            </div>
                        </div>
                        <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <strong className="w-[150px]">Dynamo Version:</strong>
                            {script.dynamoversion}
                        </div>
                        <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <strong className="w-[150px]">Dynamo Player Ready:</strong>
                            {script.dynamoplayer ? (
                                <CheckmarkCircleIcon className="w-6 h-6 text-green-500"/>
                            ) : (
                                <CloseCircleIcon className="w-6 h-6 text-red-500" />
                            )}
                        </div>
                        <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <strong className="w-[150px]">Python Scripts:</strong>
                            {script.pythonscripts ? (
                                <CheckmarkCircleIcon className="w-6 h-6 text-green-500"/>
                            ) : (
                                <CloseCircleIcon className="w-6 h-6 text-red-500" />
                            )}
                        </div>               
                        <div className="ml-2 mb-5">
                            <strong className="w-[150px]">External Packages:</strong>
                            {script.externalpackages && script.externalpackages.length > 0 ? (
                                <ul className="mt-1 space-y-1 list-disc list-inside">
                                    {script.externalpackages.map((pkg, index) => (
                                        <li key={index}>{pkg}</li>
                                    ))}
                                </ul>
                            ) : (
                                <h3 className="text-gray-500">No external packages listed.</h3>
                            )}                        
                        </div>
                    </ScrollArea>                    
                </CardContent>
                <CardFooter>
                    <LikeButton script={script} />
                    <DownloadButton script={script}/>
                </CardFooter>
            </Card>
            <Card className="md:col-span-9 h-[80vh]">
                <CardHeader>
                </CardHeader>
                <CardContent>
                    <div>
                        {nodes.length > 0 && connectors.length > 0 ? (
                            <SVGCanvasD3 nodes={nodes} connectors={connectors} canvasWidth={1325} canvasHeight={680} />
                        ) : (
                            <p className="text-gray-500">No code snippet available.</p>
                        )}                    
                    </div>
                </CardContent>
            </Card>
            
        </section>
    );
}