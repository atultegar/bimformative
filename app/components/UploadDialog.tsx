"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TagsInput } from "@/components/ui/tags-input";
import dynamoImage from "@/public/dynamo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { scriptFormSchema } from "../lib/zodSchemas";
import { addScriptToDataset } from "../actions/serverActions";
import { revalidatePath } from "next/cache";


const UploadDialog = ({userId, submitHandler}: {userId: string, submitHandler: ()=> void}) => {
    const [files, setFiles] = useState<File[] | null>(null);
    const ref = useRef<HTMLFormElement>(null);
    const [pending, setPending] = useState(false);
    
    const dropZoneConfig = {
        maxFiles: 1,
        multiple: false,
    };

    const form = useForm<z.infer<typeof scriptFormSchema>>({
        resolver: zodResolver(scriptFormSchema),
        defaultValues: {
            scriptfile: [],
            title: "",
            description: "",
            youtubevideo: "",
            tags: [],
            shareagree: false,
        },      
    });

    async function onSubmit(values: z.infer<typeof scriptFormSchema>) {
        setPending(true);
        try {
            ref.current?.reset();

            const data = new FormData();
            data.set('file', values.scriptfile[0]);

            const fnRes = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });

            if(!fnRes.ok) throw new Error(await fnRes.text());

            const fnResData = await fnRes.json();

            let dynVersion = "";
            let dynPlayer = false;
            let pythonScript = false;
            let externalPackages = [];
            let scriptView = "";

            if(fnResData.success && fnResData.data){
                dynVersion = fnResData.data.DynamoVersion;
                dynPlayer = fnResData.data.DynamoPlayerReady;
                pythonScript = fnResData.data.PythonScripts;
                externalPackages = fnResData.data.ExternalPackages;
                scriptView = JSON.stringify({ Nodes: fnResData.data.Nodes, Connectors:fnResData.data.Connectors, }, null, 2);
            }            

            const response = await addScriptToDataset(values, userId, dynVersion, dynPlayer, pythonScript, externalPackages, scriptView);

            if (response.success) {
                console.log("✅ Upload successful");
            } else {
                console.error("❌ Upload failed:", response.message);
            }
        } catch (error) {
            console.error("Form submission error", error);
        } finally {
            setPending(false);            
            submitHandler();
        }
    }

    return (
        <DialogContent>
            <Form {...form}>
                <form ref={ref} className="space-y-4 max-w-2xl mx-auto py-2" onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Image src={dynamoImage} alt="Dynamo Script" className="w-8 h-8" />
                            Upload Dynamo Script
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <FormField 
                        control={form.control} 
                        name="scriptfile"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Script File</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={field.value || []}
                                        onValueChange={(files) => field.onChange(files)}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2 justify-self-center">
                                            <FileInput id="fileinput" className="outline-dashed outline-1 outline-stone-500">
                                                <div className="flex items-center justify-center flex-col py-4 px-20 w-full">
                                                    <CloudUpload className='text-gray-500 w-10 h-10' />
                                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span>
                                                        &nbsp; or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        .dyn or .dyf
                                                    </p>
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {field.value?.length > 0 && 
                                                    field.value.map((file, i) => (
                                                        <FileUploaderItem key={i} index={i}>
                                                            <Paperclip className="h-4 w-4 stroke-current" />
                                                            <span>{file.name}</span>
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>
                                        </FileUploader>
                                </FormControl>
                            </FormItem>
                    )} />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Script Title" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="scripttype"
                        render={({field}) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Type</FormLabel>                            
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row gap-5">
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Revit" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Revit
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Civil3D" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Civil 3D
                                                </FormLabel>
                                            </FormItem>
                                    </RadioGroup>
                                </FormControl>                       
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Script description"
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />                
                    <FormField
                        control={form.control}
                        name="youtubevideo"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Demo Link</FormLabel>                            
                                <FormControl>
                                    <Input
                                        placeholder="e.g. https://www.youtube.com/watch?v=xxxxxxx"
                                        type="url"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>                            
                                <FormControl>
                                    <TagsInput
                                        value={field.value ?? []}
                                        onValueChange={field.onChange}
                                        placeholder="column, coordinates, ..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shareagree"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(checked) => field.onChange(checked)} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>By clicking this, you agree that the script you upload will be publicly accessible and freely available for all users to use and share on BIMformative.</FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"secondary"}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={pending}>{pending ? "Submitting..." : "Submit"}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>

    );
}

export default UploadDialog;