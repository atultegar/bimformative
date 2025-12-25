import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
const UpdateDialog = ({ scriptId, submitHandler }: { scriptId: string, submitHandler: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [versions, setVersions] = useState<any[] | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        script_type: "",
        tags: [] as string[],
        current_version_number: 0,
    });

    useEffect(() => {
        if (!scriptId) return;

        const load = async () => {
            setLoading(true);

            const sRes = await fetch(`/api/scripts/by-id/${scriptId}`, {
                method: "GET",
                headers: { "x-api-key": API_KEY }
            });
            const sJson = await sRes.json();

            const vRes = await fetch(`/api/scripts/by-id/${scriptId}/get-versions`, {
                method: "GET",
                headers: { "x-api-key": API_KEY }
            });

            const vJson = await vRes.json();

            if (sJson.script) {
                setFormData({
                    title: sJson.script.title,
                    description: sJson.script.description,
                    script_type: sJson.script.script_type,
                    tags: sJson.script.tags ?? [],
                    current_version_number: sJson.script.current_version_number,
                });
            }

            if (vJson.versions) setVersions(vJson.versions);

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

        const res = await fetch(`/api/scripts/by-id/${scriptId}`, {
            method: "PATCH",
            headers: { 
                "x-api-key": API_KEY, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                ...formData,
                current_version_number: Number(formData.current_version_number),
            }),
        });

        const json = await res.json();

        if (json.message === "Script updated successfully") {
            alert("Script updated successfully")
        } else {
            alert(json.error || "Failed to update script");
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
                            value={formData.current_version_number.toString()}
                            onValueChange={(v) => updateField("current_version_number", Number(v))}     
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
