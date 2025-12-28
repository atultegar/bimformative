import { VersionPublish } from "@/lib/types/script";
import { startTransition, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { analyzeDynamoFileAction, publishVersionAction } from "../actions/serverActions";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UploadVersionDialog({
    slug, 
    open, 
    onOpenChange
}: {
    slug: string;
    open: boolean;
    onOpenChange: (v:boolean) => void;
}) {
    const [pendingAnalyze, setPendingAnalyze] = useState(false);
    const [pendingPublish, setPendingPublish] = useState(false);    
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analyzeData, setAnalyzeData] = useState<any>(null);

    const form = useForm<VersionPublish>({
        defaultValues: {
            scriptFile: undefined,
            changelog: "",
        },
    });

    async function handleAnalyze() {
        if (!uploadedFile) {
            alert("Please upload a Dynamo (.dyn) file first.");
            return;
        }

        setPendingAnalyze(true);

        try {
            const { parsedJson, scriptData } = await analyzeDynamoFileAction(uploadedFile);

            // Store for publish step
            setAnalyzeData(scriptData);
            form.setValue("scriptFile", uploadedFile);
        } catch (err: any) {
            console.error("Analyze failed", err);
            alert(err.message ?? "Analyze failed");
        } finally {
            setPendingAnalyze(false);
        }
    }

    async function handlePublish(values: VersionPublish) {
        if (!analyzeData) {
            alert("Analyze the script first.");
            return;
        }
        setPendingPublish(true);

        startTransition(async () => {
            await publishVersionAction(slug, values.scriptFile, analyzeData, values.changelog);
            alert("Version published successfully");
            resetAll();
            setPendingPublish(false);
            onOpenChange(false);
        });
    }

    function resetAll() {
        setUploadedFile(null);
        setAnalyzeData(null);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Version</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-6">
                        <FormItem>
                            <FormLabel>Upload Version</FormLabel>
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

                        <div className={analyzeData ? "space-y-2" : "opacity-50 pointer-events-none space-y-3"}>
                            {/* TITLE */}
                            <FormField
                                control={form.control}
                                name="changelog"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="mx-3">Changelog</FormLabel>
                                        <FormControl>
                                            <Input placeholder="changelog" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
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
        </Dialog>
    )
}