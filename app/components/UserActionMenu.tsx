import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppWindow, Edit, FileUp, Lock, LockOpen, MoreHorizontal, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import EditDialog from "./scripts/EditDialog";
import { ScriptDashboard } from "@/lib/types/script";
import { deleteScriptAction, updateScriptStatusAction } from "../actions/serverActions";
import { useRouter } from "next/navigation";
import UploadVersionDialog from "./UploadVersion";
import { toast } from "sonner";

export default function UserActionMenu({script}: {script: ScriptDashboard}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleStatusToggle = () => {
        startTransition(async () => {
            const res = await updateScriptStatusAction(script.id, script.is_public);

            if (res === "SUCCESS") {
                toast.success(script.is_public ? "Script set to private" : "Script set to public");
                router.refresh();
            } else {
                toast.error("Error updating script");
            }    
        });
    };

    async function handleScriptDelete() {
        await deleteScriptAction(script.id);
        setShowDeleteDialog(false);
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" aria-label="Open menu" size="icon">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="end">                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/resources/dynamo-scripts/${script.slug}`}>
                            <AppWindow />
                            Details
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        <Edit />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={handleStatusToggle} disabled={isPending}>
                        {script.is_public ? <Lock /> : <LockOpen/>}
                        {script.is_public ? "Make Private" : "Make Public"}
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => setShowUploadDialog(true)}>
                        <FileUp />
                        Upload Version
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem 
                        className="text-red-600"
                        onSelect={() => setShowDeleteDialog(true)}>
                        <TriangleAlert />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await handleScriptDelete();
                    }}
                    >
                        <DialogHeader>
                            <DialogTitle>Delete Script</DialogTitle>
                            <DialogDescription>
                                Are you sure want to delete this script?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-5">
                            <DialogClose asChild>
                                <Button type="button" variant={"outline"}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant={"destructive"}>Delete</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <EditDialog open={showEditDialog} onOpenChange={setShowEditDialog} script={script} />

            <UploadVersionDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} slug={script.slug} />
        </>
    )
}