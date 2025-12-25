"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    DialogClose, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { 
    FileInput, 
    FileUploader, 
    FileUploaderContent, 
    FileUploaderItem
} from "@/components/ui/file-upload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TagsInput } from "@/components/ui/tags-input";
import dynamoImage from "@/public/dynamo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { scriptFormSchema } from "../lib/zodSchemas";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

const UploadDialog = ({userId, submitHandler}: {userId: string, submitHandler: ()=> void}) => {    
    const [pendingAnalyze, setPendingAnalyze] = useState(false);
    const [pendingPublish, setPendingPublish] = useState(false);    
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analyzeData, setAnalyzeData] = useState<any>(null);

    
    const form = useForm<z.infer<typeof scriptFormSchema>>({
        resolver: zodResolver(scriptFormSchema),
        defaultValues: {
            scriptFile: [],
            title: "",
            description: "",
            youtubevideo: "",
            tags: [],
            scripttype: "Revit",
            shareagree: false,
        },      
    });

    // ----------------------
    // STEP 1: Analyze Script
    // ----------------------
    async function handleAnalyze() {
        if (!uploadedFile) return alert("Please upload a Dynamo (.dyn) file first.");
        
        setPendingAnalyze(true);

        try {
            const fd = new FormData();
            fd.append("file", uploadedFile ?? "");

            const res = await fetch("/api/scripts/analyze", {
                method: "POST",
                headers: { "x-api-key": API_KEY },
                body: fd,
            });

            if (!res.ok) throw new Error(await res.text());

            const parsed = await res.json();
            const scriptData = parsed.scriptData;
            console.log(scriptData); //Check - Remove after
            setAnalyzeData(scriptData);

            form.setValue("title", scriptData.Name ?? "");
            form.setValue("description", scriptData.Description ?? "");
            form.setValue("scriptFile", [uploadedFile]);
        } catch (err) {
            console.error("Analyze failed", err);
            alert("Analyze failed");
        } finally {
            setPendingAnalyze(false);
        }        
    }

    // ----------------------
    // STEP 2: Publish Script
    // ----------------------
    async function handlePublish(values: z.infer<typeof scriptFormSchema>) {
        if (!analyzeData) return alert("Analyze the script first.");
        
        setPendingPublish(true);

        try {
            const fd = new FormData();
            fd.append("file", values.scriptFile[0]);
            fd.append("title", values.title);
            fd.append("description", values.description);
            fd.append("tags", values.tags.join(","));
            fd.append("scriptType", values.scripttype);
            if (values.youtubevideo) {
                fd.append("demoLink", values.youtubevideo);
            }
            fd.append("parsedJson", JSON.stringify(analyzeData));
            fd.append("isPublic", values.shareagree ? "true" : "false")

            const res = await fetch("/api/scripts/publish", {
                method: "POST",
                headers: { "x-api-key": API_KEY },
                body: fd,
            });

            if (!res.ok) throw new Error(await res.text());

            submitHandler();
            alert("Script published successfully");
        } catch (err) {
            console.error("Publish failed:", err);
            alert("Publish failed");
        } finally {
            resetAll();
            setPendingPublish(false);
        }        
    }

    // RESET WHEN CLOSING
    function resetAll() {
        setUploadedFile(null);
        setAnalyzeData(null);
        form.reset();
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Image src={dynamoImage} alt="Dynamo Script" className="w-8 h-8" />
                    Upload Dynamo Script
                </DialogTitle>
            </DialogHeader>

            {/* MAIN FORM */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-6">
                    {/* FILEUPLOAD - Always visible */}
                    <FormItem>
                        <FormLabel>Upload Script (.dyn)</FormLabel>
                        <FormControl>
                            <FileUploader
                                value={uploadedFile ? [uploadedFile] : []}
                                onValueChange={(files) => setUploadedFile(files?.[0] ?? null)}
                                dropzoneOptions={{ maxFiles: 1 }}
                                className="relative bg-background rounded-lg p-2 justify-self-center"
                            >
                                <FileInput id="fileinput" className="outline-dashed outline-1 outline-stone-500">
                                    <div className="flex items-center justify-center flex-col py-4 px-20 w-full">
                                        <CloudUpload className='text-gray-500 w-10 h-10' />
                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span>
                                            &nbsp; or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            .dyn only
                                        </p>
                                    </div>
                                </FileInput>
                                <FileUploaderContent>
                                    {uploadedFile && (
                                        <FileUploaderItem index={0}>
                                            <Paperclip className="h-4 w-4 stroke-current" />
                                            <span>{uploadedFile.name}</span>
                                        </FileUploaderItem>
                                        )}
                                </FileUploaderContent>
                            </FileUploader>
                        </FormControl>
                    </FormItem>

                    {/* ANALYZE BUTTON */}
                    <Button type="button" disabled={!uploadedFile || pendingAnalyze} onClick={handleAnalyze}>
                        {pendingAnalyze ? "Analyzing..." : "Analyze"}
                    </Button>

                    {/* METADATA FIELDS - they stay visible but disables until analyzed */}
                    <div className={analyzeData ? "space-y-2" : "opacity-50 pointer-events-none space-y-3"}>
                        {/* TITLE */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="mx-3">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Script Title" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* DESCRIPTION */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="mx-3">Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Short description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SCRIPT TYPE */}
                        <FormField
                            control={form.control}
                            name="scripttype"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="mx-3">Script Type</FormLabel>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-5 mx-3">
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="Revit" />
                                            <FormLabel className="font-normal">Revit</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="Civil3D" />
                                            <FormLabel className="font-normal">Civil 3D</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormItem>
                            )}
                        />

                        {/* DEMO LINK */}             
                        <FormField
                            control={form.control}
                            name="youtubevideo"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="mx-3">Demo Link</FormLabel>                            
                                    <FormControl>
                                        <Input placeholder="e.g. https://www.youtube.com/watch?v=xxxxxxx" type="url" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* TAGS */}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="mx-3">Tags</FormLabel>                            
                                    <FormControl>
                                        <TagsInput
                                            value={field.value ?? []}
                                            onValueChange={field.onChange}
                                            placeholder="parameter, geometry..." 
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* AGREEMENT */ }
                        <FormField
                            control={form.control}
                            name="shareagree"
                            render={({field}) => (
                                <FormItem className="space-y-2 rounded-md border p-4">
                                    <div className="flex flex-row items-start space-x-3">
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        <FormLabel>
                                            Public
                                        </FormLabel>
                                    </div>                                    
                                    <FormMessage>
                                        Public scripts are visible to everyone. Private scripts are visible only to you.
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-2">
                            <DialogClose asChild>
                                <Button type="button" variant={"secondary"} onClick={resetAll}>Cancel</Button>
                            </DialogClose>

                            <Button type="submit" disabled={!analyzeData || pendingPublish}>
                                {pendingPublish ? "Publishing..." : "Publish"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </Form>                     
        </DialogContent>
    );
};

export default UploadDialog;