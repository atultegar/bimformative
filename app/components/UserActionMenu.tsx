import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppWindow, Edit, FileUp, MoreHorizontal, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import EditDialog from "./scripts/EditDialog";
import { ScriptDashboard } from "@/lib/types/script";
import { updateScriptStatusAction } from "../actions/serverActions";
import { useRouter } from "next/navigation";


async function updateScriptStatus(scriptId: string, isPublic: boolean, currentUserId: string) {
    const router = useRouter();
    const res = await updateScriptStatusAction(scriptId, isPublic, currentUserId);

    const message = isPublic ? "Script set to private" : "Script set to public";

    if (res === "SUCCESS") {
        alert(message);
        router.refresh();
    } else {
        alert("Error updating script");
    }    
}

export default function UserActionMenu({script, currentUserId}: {script: ScriptDashboard, currentUserId: string}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleStatusToggle = () => {
        startTransition(async () => {
            const res = await updateScriptStatusAction(script.id, script.is_public, currentUserId);

            if (res === "SUCCESS") {
                alert(script.is_public ? "Script set to private" : "Script set to public");
                router.refresh();
            } else {
                alert("Error updating script");
            }    
        });
    };

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
                        <Edit />
                        {script.is_public ? "Make Private" : "Make Public"}
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => setShowUploadDialog(true)}>
                        <FileUp />
                        Upload Version
                    </DropdownMenuItem>

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
                    <DialogHeader>
                        <DialogTitle>Delete Script</DialogTitle>
                        <DialogDescription>
                            Are you sure want to delete script?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant={"destructive"}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <EditDialog open={showEditDialog} onOpenChange={setShowEditDialog} script={script} />
        </>
    )
}