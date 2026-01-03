import { getScriptByIdAction, getScriptVersionsAction, updateScriptAction } from "@/app/actions/serverActions";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScriptUpdate } from "@/lib/types/script";
import { MinimalVersion } from "@/lib/types/version";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
const UpdateDialog = ({ scriptId, submitHandler }: { scriptId: string, submitHandler: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [versions, setVersions] = useState<MinimalVersion[]>([]);

    const [formData, setFormData] = useState<ScriptUpdate>({
        title: "",
        description: "",
        script_type: "",
        tags: [] as string[],
        current_version: "",
    });

    useEffect(() => {
        if (!scriptId) return;

        const load = async () => {
            setLoading(true);

            // Use server action
            const script = await getScriptByIdAction(scriptId);

            const versions = await getScriptVersionsAction(scriptId);

            if (script) {
                setFormData({
                    title: script.title,
                    description: script.description,
                    script_type: script.script_type,
                    tags: script.tags ?? [],
                    current_version: script.current_version_number,
                });
            }

            if (versions.length > 0) setVersions(versions);

            setLoading(false);
        };
        
        load();
    }, [scriptId]);

    //** Update form fields */
    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /** Submit */
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await updateScriptAction(scriptId, formData);

        if (res === "SUCCESS") {
            toast.success("Script updated successfully")
        } else {
            toast.error("Failed to update script");
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Script</DialogTitle>
                <DialogDescription>
                    Update script details & select the current version.
                </DialogDescription>
            </DialogHeader>

            {loading ? (
                <p className="text-sm opacity-70 py-6">Loading...</p>  
            ) : (
                <form className="space-y-4" onSubmit={handleFormSubmit}>

                    {/* Title */}
                    <div>
                        <Label>Title</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => updateField("title",e.target.value)}>
                        </Input>
                    </div>

                    {/* Version Selector */}
                    <div>
                        <Label>Select Current Version</Label>
                        <Select
                            value={formData.current_version}
                            onValueChange={(v) => updateField("current_version", v)}     
                        >
                            <SelectTrigger className="w-[250px]">
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
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant={"secondary"}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleFormSubmit} variant={"default"}>
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </>
    );
};

export default UpdateDialog;
