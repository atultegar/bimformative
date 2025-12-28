"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";

import { ScriptDashboard, ScriptUpdate } from "@/lib/types/script";
import { getScriptVersionsAction, updateScriptAction } from "@/app/actions/serverActions";

type Version = {
    id: string;
    version_number: number;
};

export default function EditDialog({
    script, 
    open,
    onOpenChange,
}: {
    script: ScriptDashboard;
    open: boolean;
    onOpenChange: (v:boolean) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [versions, setVersions] = useState<Version[]>([]);

    const form = useForm<ScriptUpdate>({
        defaultValues: {
            title: "",
            description: "",
            script_type: "",
            tags: [],
            current_version: "",
        },
    });

    // Load versions ib open
    useEffect(() => {
        if (!open) return;

        startTransition(async () => {
            const v = await getScriptVersionsAction(script.id);
            setVersions(v ?? []);

            form.reset({
                title: script.title,
                description: script.description,
                script_type: script.script_type,
                tags: script.tags,
                current_version: script.current_version_number.toString(),
            });
        });
    }, [open, script, form])

    
    // Submit
    function onSubmit(values: ScriptUpdate) {
        startTransition(async () => {
            await updateScriptAction(script.id, values);

            onOpenChange(false);
        });
    }    

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <Form {...form}>
                    <form className="space-y-4 py-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Edit Script</DialogTitle>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ScriptTitle" type="text" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="script_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex gap-6"
                                        >
                                            {["revit", "civil3d"].map((t) => (
                                                <FormItem key={t} className="flex items-center gap-2">
                                                    <FormControl>
                                                        <RadioGroupItem value={t} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal capitalize">
                                                        {t}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                                {/* <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="revit"/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Revit</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="civil3d"/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Civil 3D</FormLabel>
                                                </FormItem> */}
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <TagsInput
                                            value={field.value ?? []}
                                            onValueChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="current_version"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Version</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select version" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {versions && versions.length > 0 ? (
                                                    versions.map((v) => (
                                                        <SelectItem
                                                            key={v.id}
                                                            value={v.version_number.toString()}
                                                        >
                                                            V{v.version_number}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground">
                                                        No versions found
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant={"secondary"}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}