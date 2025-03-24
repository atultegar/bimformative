"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { client } from "../lib/sanity";

const formSchema = z.object({
    scriptfile: z.array(z.string()),
    title: z.string().min(3).max(50),
    scripttype: z.string(),
    description: z.string().min(1).optional(),
    youtubevideo: z.string().min(1).optional(),
    tags: z.array(z.string()).optional().default([]),
    shareagree: z.boolean().optional(),    
})

export default function UploadForm() {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 1,
        multiple: false,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),        
    })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    const addScript = async(formData: FormData) => {
        const title = formData.get("title");
        
        // add sanity client to add document

        console.log(title);

    }
    
    return (
        // <ScrollArea className="h-[720px]">
        <Form {...form}>
            <form action={addScript} className="space-y-4 max-w-2xl mx-auto py-2">                
                <FormField 
                    control={form.control} 
                    name="scriptfile" 
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Script File</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={files}
                                    onValueChange={setFiles}
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
                                    className="flex flex-col space-y-1">
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="revit" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Revit
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="civil3d" />
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
                                    placeholder="e.g. https://www.youtube.com/watch?v=xxxxxxxx"
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
                                    value={field.value}
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
                                    checked={field.value}
                                    onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>By clicking this, you agree that the script you upload will be publicly accessible and freely available for all users to use and share on BIMformative.</FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <Button className="flex place-self-center w-[200px]" type="submit">Submit</Button>
            </form>
        </Form>
        // </ScrollArea>
    )
}