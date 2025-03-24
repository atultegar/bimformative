import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DynamoScript } from "../resources/dynamo-scripts/columns";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import dynamoImage from "@/public/dynamo.png";
import { Input } from "@/components/ui/input";
import { TagsInput } from "@/components/ui/tags-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addScriptToDataset, updateScriptInDataset } from "../actions/serverActions";

export default function DialogEdit({script, submitHandler}: {script: DynamoScript, submitHandler: () => void}) {
    const [pending, setPending] = useState(false);
    const ref = useRef<HTMLFormElement>(null);

    const form = useForm();

    async function onLoad() {
        form.reset({
            title: script.title,
            scripttype: script.scripttype,
            description: script.description,
            youtubevideo: script.youtubelink,
            tags: script.tags
        });
    }

    async function onSubmit(values: any) {
        setPending(true);
        try{
            ref.current?.reset();

            console.log(values);
            const response = await updateScriptInDataset(values, script._id);
        } catch (error) {
            console.error(error);
        }
        finally {
            setPending(false);
            submitHandler();
        }        
    }
    return (
        <>
        
        <Form {...form}>
            <form ref={ref} className="space-y-4 py-2" onLoad={onLoad} onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Image src={dynamoImage} alt="Edit Dynamo Script" className="w-8 h-8"/>
                        Edit Script
                    </DialogTitle>
                    <DialogDescription></DialogDescription>           
                </DialogHeader>
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="ScriptTitle" type="text" {...field} />
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
                                     />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>            
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={pending}>{pending ? "Submitting..." : "Submit"}</Button>            
                </DialogFooter>
            </form>
        </Form>        
        </>        
    );
}