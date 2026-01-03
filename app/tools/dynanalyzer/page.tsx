'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import SVGCanvasD3 from "../../components/svg/SvgCanvasD3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckmarkCircleIcon, CloseCircleIcon } from "@sanity/icons";
import { TagsInput } from "@/components/ui/tags-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CodeBlock from "../../components/CodeBlock";
import { FaPython } from "react-icons/fa6";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";
import { analyzeDynamoFileAction } from "@/app/actions/serverActions";
import { toast } from "sonner";


export default function DynAnalyzerPage() {
    const [files, setFiles] = useState<File[] | null> (null);
    const [status, setStatus] = useState<"success" | "error" | "loading" | "idle">("idle");
    const [nodes, setNodes] = useState<any[]>([]);
    const [connectors, setConnectors] = useState<any[]>([]);
    const [scriptName, setScriptName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [version, setVersion] = useState<string>("");
    const [dynamoPlayer, setDynamoPlayer] = useState<boolean>(false);
    const [pythonScripts, setPythonScripts] = useState<boolean>(false);
    const [externalPackages, setExternalPackages] = useState<string[]>([]);
    
    const dropZoneConfig = {
        maxFiles: 1,
        multiple: false,
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!files) {
            toast.warning("Please select a file to upload")
            return;
        }

        try {
            setStatus("loading");
            const data = new FormData();
            data.set('file', files[0])

            const res = await analyzeDynamoFileAction(files[0]);
            if (!res) throw new Error("File error");

            if (res.scriptData) {
                setNodes(res.scriptData.Nodes || []);
                setConnectors(res.scriptData.Connectors || []);
                setScriptName(res.scriptData.Name || "");
                setDescription(res.scriptData.Description || "");
                setVersion(res.scriptData.DynamoVersion || "");
                setDynamoPlayer(res.scriptData.DynamoPlayerReady || false);
                setPythonScripts(res.scriptData.PythonScripts || false);
                setExternalPackages(res.scriptData.ExternalPackages || []);
                
                setStatus("success");
            }           

        } catch (e:any) {
            toast.error("Upload error:", e);
            setStatus("error");
        }
    };

    return (
        <section className="w-full mx-auto bg-gray-100 dark:bg-black justify-items-center items-center">
                    
            <div>
                <Card className="bg-white dark:bg-transparent">
                    <CardHeader>
                        <CardTitle>Dynamo Script Analyzer</CardTitle>
                    </CardHeader>
                    <CardContent className="max-w-7xl mx-auto justify-items-start">
                        <form className="flex items-center p-2 gap-5 max-w-3xl mx-auto" onSubmit={onSubmit}>                    
                            <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={dropZoneConfig} className="relative rounded-lg p-2 justify-self-center">
                                <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500 dark:outline-gray-100">
                                    <div className="flex items-center justify-center flex-col py-4 px-24 w-full">
                                        <CloudUpload className="text-gray-500 dark:text-gray-100 w-10 h-10" />
                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-100">
                                            <span className="font-semibold">Click to upload</span>
                                            &nbsp; or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-100">
                                            .dyn or dyf
                                        </p>
                                    </div>
                                </FileInput>
                                <FileUploaderContent>
                                    {files &&
                                    files.length > 0 &&
                                    files.map((file, i) => (
                                        <FileUploaderItem key={i} index={i}>
                                            <Paperclip className="h-4 w-4 stroke-current" />
                                            <span>{file.name}</span>
                                        </FileUploaderItem>
                                    ))}
                                </FileUploaderContent>
                            </FileUploader>
                            <Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Uploading..." : "Submit"}</Button>                
                        </form>
                        <hr className="h-1 w-full"/>
                        <div className="flex w-full items-center gap-5 mb-5 mt-5">
                            <Label className="w-[250px]">Title</Label>
                            <Input defaultValue={scriptName} />
                        </div>
                        <div className="flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <Label className="w-[250px]">Description</Label>
                            <Input defaultValue={description} />
                        </div>
                        <div className="flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <Label className="w-[250px]">Dynamo Version</Label>
                            <Input defaultValue={version} />
                        </div>
                        <div className="flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <Label className="w-[200px]">Dynamo Player Ready</Label>
                            {dynamoPlayer ? (
                                <CheckmarkCircleIcon className="w-8 h-8 text-green-500" />
                            ) : (
                                <CloseCircleIcon className="w-8 h-8 text-red-500" />
                            )}                            
                        </div>
                        <div className="flex flex-row w-full items-start gap-5 mb-5">
                            <Label className="w-[200px] flex-shrink-0">Python Scripts</Label>
                            <div className="flex flex-wrap items-center gap-3">
                                {pythonScripts && nodes.length > 0 ? (
                                    nodes.map((item, idx) =>
                                        item.NodeType === "PythonScriptNode" && (
                                            <div key={idx} className="flex items-center gap-3">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant={"outline"}>
                                                            <FaPython className="w-6 h-6" />
                                                            Script
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-7xl max-h-[80vh] bg-transparent border-none">
                                                        <DialogTitle></DialogTitle>
                                                        <CodeBlock language="python" code={item.Code} title={item.Name} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div> 
                                        )
                                    )                               
                                ) : (
                                    <CloseCircleIcon className="w-8 h-8 text-red-500" />
                                )}

                            </div>                            
                        </div>
                        <div className="flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                            <Label className="w-[200px]">External Packages</Label>
                            <TagsInput value={externalPackages} onValueChange={function (value: string[]): void {
                                throw new Error("Function not implemented.");
                            } } />
                        </div>
                        <div className="flex items-center">
                            <SVGCanvasD3 nodes={nodes} connectors={connectors} canvasWidth={1200} canvasHeight={600} />
                        </div>
                        
                    </CardContent>
                </Card>    
            </div>
        </section>
    )
}