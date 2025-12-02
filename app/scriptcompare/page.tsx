"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";
import ScriptCompare from "../components/ScriptCompare";
import Image from "next/image";
import dynamoImage from "@/public/dynamo.png";

export default function ScriptComparePage() {
    const [files, setFiles] = useState<File[] | null>(null);
    const [fileA, setFileA] = useState<File[] | null>(null);
    const [fileB, setFileB] = useState<File[] | null>(null);
    const [oldNodes, setOldNodes] = useState<any[]>([]);
    const [oldConnectos, setOldConnectors] = useState<any[]>([]);
    const [newNodes, setNewNodes] = useState<any[]>([]);
    const [newConnectors, setNewConnectors] = useState<any[]>([]);
    const [loading, setLoading] = useState<any | null>(null);

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

    const dropZoneConfig = {
        maxFiles: 1,
        multiple: false,
    };

    const uploadFile = async (file: File) => {
        const data = new FormData();
        data.set("file", file);


        const res = await fetch("/api/scripts/analyze", {
            method: "POST",
            headers: {
                "x-api-key": API_KEY
            },
            body: data,
        });

        if (!res.ok) {
            console.error(await res.text());
            throw new Error("Upload failed");
        }

        return res.json();
    };

    const handleCompare = async() => {
        if (!fileA || !fileB) {
            alert("Please upload BOTH files");
            return;
        }

        setLoading(true);

        try {
            const [resultA, resultB] = await Promise.all([
                uploadFile(fileA[0]),
                uploadFile(fileB[0]),
            ]);

            setOldNodes(resultA.scriptData.Nodes);
            setNewNodes(resultB.scriptData.Nodes);
            setOldConnectors(resultA.scriptData.Connectors);
            setNewConnectors(resultB.scriptData.Connectors);

        } catch (err) {
            console.error("Comparison Error:", err);
            alert("Failed to compare scripts.")
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
                    {oldNodes && newNodes && (
                        <div className="mt-10">
                            <ScriptCompare 
                                oldNodes={oldNodes} 
                                newNodes={newNodes} 
                                oldConnectors={oldConnectos}
                                newConnectors={newConnectors} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}