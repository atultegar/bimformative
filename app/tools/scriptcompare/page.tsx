"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { CheckCircle, CloudUpload, Paperclip, XCircle } from "lucide-react";
import ScriptCompare from "../../components/ScriptCompare";
import Image from "next/image";
import dynamoImage from "@/public/dynamo.png";
import { analyzeDynamoFileAction } from "../../actions/serverActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { diffScripts } from "@/lib/diff/diffScripts";
import NodeValueDiff from "@/app/components/scripts/NodeValueDiff";
import SideBySideDiff from "@/app/components/SideBySideDiff";
import { toast } from "sonner";


function renderChangedNodeDiff(nodeA:any, nodeB:any) {
    switch (nodeA.NodeType) {
        case "CodeBlockNode":
        case "StringInputNode":
        case "NumberInputNode":
        case "BooleanInputNode":
            return (
                <NodeValueDiff
                    title={`${nodeA.Name} - Input changed`}
                    oldValue={nodeA.InputValue || ""}
                    newValue={nodeB.InputValue || ""}
                    language="text"
                    darkMode={true}
                />
            );

        case "PythonScriptNode":
            return (
                <SideBySideDiff
                    oldValue={nodeA.Code}
                    newValue={nodeB.Code}
                    title={nodeA.Name ?? "Python Script"}
                    darkMode={true}
                 />
            );

        default:
            return null;        
    }
}
export default function ScriptComparePage() {
    const [fileA, setFileA] = useState<File[] | null>(null);
    const [fileB, setFileB] = useState<File[] | null>(null);
    const [oldNodes, setOldNodes] = useState<any[]>([]);
    const [oldConnectos, setOldConnectors] = useState<any[]>([]);
    const [newNodes, setNewNodes] = useState<any[]>([]);
    const [newConnectors, setNewConnectors] = useState<any[]>([]);
    const [loading, setLoading] = useState<any | null>(null);

    const [fileAData, setfileAData] = useState<any | null>(null);
    const [fileBData, setfileBData] = useState<any | null>(null);

    const [changedNodeIds, setChangedNodeIds] = useState<Set<string>>(new Set());

    const dropZoneConfig = {
        maxFiles: 1,
        multiple: false,
    };

    const uploadFile = async (file: File) => {
        const data = new FormData();
        data.set("file", file);


        const res = await analyzeDynamoFileAction(file);

        if (!res) {
            throw new Error("Upload failed");
        }

        return res.scriptData;
    };

    const handleCompare = async() => {
        if (!fileA || !fileB) {
            toast.warning("Please upload BOTH files");
            return;
        }

        setLoading(true);

        try {
            const [resultA, resultB] = await Promise.all([
                uploadFile(fileA[0]),
                uploadFile(fileB[0]),
            ]);

            setfileAData(resultA);
            setfileBData(resultB);

            setOldNodes(resultA.Nodes);
            setNewNodes(resultB.Nodes);
            setOldConnectors(resultA.Connectors);
            setNewConnectors(resultB.Connectors);

            const scriptDifference = diffScripts(oldNodes, newNodes);

            setChangedNodeIds(scriptDifference.changedNodeIds);

        } catch (err: any) {
            toast.error("Comparison Error:", err);
        } finally {
            setLoading(false);
        }
    };    

    

    return (
        <section className="w-full max-w-7xl mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Image src={dynamoImage} alt="Dynamo Script" className="w-8 h-8" />
                            Dynamo Script Compare
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-10">
                    {/* upload zones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT UPLOAD */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium ml-5">Upload Script A</h3>

                            <FileUploader value={fileA} onValueChange={setFileA}
                                dropzoneOptions={dropZoneConfig} className="relative bg-background rounded-lg p-2 justify-self-center">
                                    <FileInput className="outline-dashed outline-1 outline-stone-500">
                                        <div className="flex flex-col items-center justify-center py-4 px-20 w-full">
                                            <CloudUpload className="w-10 h-10 text-gray-500" />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span>
                                                &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                .dyn
                                            </p>
                                        </div>
                                    </FileInput>

                                    <FileUploaderContent>
                                        {fileA?.map((file, i) => (
                                            <FileUploaderItem key={i} index={i}>
                                                <Paperclip className="h-4 w-4" />
                                                {file.name}
                                            </FileUploaderItem>
                                        ))}
                                    </FileUploaderContent>
                            </FileUploader>
                        </div>
                        
                        {/* RIGHT UPLOAD */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium ml-5">Upload Script B</h3>

                            <FileUploader value={fileB} onValueChange={setFileB}
                                dropzoneOptions={dropZoneConfig} className="relative bg-background rounded-lg p-2 justify-self-center">
                                    <FileInput className="outline-dashed outline-1 outline-stone-500">
                                        <div className="flex flex-col items-center justify-center py-4 px-20 w-full">
                                            <CloudUpload className="w-10 h-10 text-gray-500" />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span>
                                                &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                .dyn
                                            </p>
                                        </div>
                                    </FileInput>

                                    <FileUploaderContent>
                                        {fileB?.map((file, i) => (
                                            <FileUploaderItem key={i} index={i}>
                                                <Paperclip className="h-4 w-4" />
                                                {file.name}
                                            </FileUploaderItem>
                                        ))}
                                    </FileUploaderContent>
                            </FileUploader>
                        </div>

                    </div>

                    {/* Compare Button */}
                    <div className="flex justify-center">
                        <Button
                            disabled={loading || !fileA || !fileB}
                            onClick={handleCompare}
                        >
                            {loading ? "Analyzing..." : "Compare Scripts"}
                        </Button>
                    </div>

                    {/* Output Comparison */}
                    {/* Verison Metadata */}
                    <div className="grid grid-cols-2 gap-8 border-b pb-4">
                        {/* Version A */}
                        <div className="space-y-2">
                            <h4 className="font-semibold justify-center">
                                File: {fileAData?.Name}
                            </h4>                    
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold justify-center">
                                File: {fileBData?.Name}
                            </h4>                    
                        </div>
                    </div>
                    <ScrollArea className="h-[600px] pr-2">
                        <div className="grid grid-cols-2 gap-8 py-3 pb-2">
                            {/* Script A Metadata */}
                            <div className="space-y-2">                                
                                <Section title="Dynamo Version">
                                    <span>{fileAData?.DynamoVersion}</span>
                                </Section>
                                <Section title="Dynamo Player Ready">
                                    {fileAData?.DynamoPlayerReady ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                </Section>
                                <Section title="External Packages">
                                    {fileAData?.ExternalPackages?.length > 0 ? (
                                        <ul className="list-disc pl-5 space-y-1">
                                            {fileAData?.ExternalPackages.map((pkg: string, i: number) => (
                                                <li key={i}>{pkg}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No external packages used.</p>
                                    )}
                                </Section>
                            </div>

                            {/* Script B Metadata */}
                            <div className="space-y-2">                                
                                <Section title="Dynamo Version">
                                    <span>{fileBData?.DynamoVersion}</span>
                                </Section>
                                <Section title="Dynamo Player Ready">
                                    {fileBData?.DynamoPlayerReady ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                </Section>
                                <Section title="External Packages">
                                    {fileBData?.ExternalPackages?.length > 0 ? (
                                        <ul className="list-disc pl-5 space-y-1">
                                            {fileBData?.ExternalPackages.map((pkg: string, i: number) => (
                                                <li key={i}>{pkg}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No external packages used.</p>
                                    )}
                                </Section>
                            </div>
                        </div>
                        
                        <ScriptCompare 
                                oldNodes={oldNodes} 
                                newNodes={newNodes} 
                                oldConnectors={oldConnectos}
                                newConnectors={newConnectors} 
                        />

                        <div className="space-y-6 mt-6">
                            <h4 className="text-sm font-semibold mb-1 text-gray-700">Changed Nodes</h4>
                            {changedNodeIds && (
                                <p className="text-sm text-gray-500">No input/code changes detected.</p>
                            )}

                            {Array.from(changedNodeIds).map((nodeId) => {
                                const oldNode = fileAData?.nodes.find((n:any) => n.Id === nodeId);
                                const newNode = fileBData?.nodes.find((n:any) => n.Id === nodeId);
                                if(!oldNode || !newNode) return null;

                                return (
                                    <div key={nodeId}>
                                        {renderChangedNodeDiff(oldNode, newNode)}
                                    </div>
                                )
                            })}

                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </section>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-1 text-gray-700">{title}</h4>
            <div className="text-sm">{children}</div>
        </div>
    );
}