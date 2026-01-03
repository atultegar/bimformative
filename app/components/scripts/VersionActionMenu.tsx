import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, LaptopMinimal, MoreHorizontal, ListX } from "lucide-react";
import { handleScriptVersionDownload } from "@/app/actions/clientActions";
import { MinimalVersion } from "@/lib/types/version";
import { deleteVersionAction, setCurrentVersionAction } from "@/app/actions/serverActions";

export default function VersionActionMenu({ title, version, userId }: { title: string, version: MinimalVersion, userId: string }) {
    enum Dialogs {
        delete = "deleteDialog",
        update = "updateDilaog",
    }
    const [dialog, setDialog] = useState<Dialogs | null>(null);
    
    return (
        <>
            {/* Main actions dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleScriptVersionDownload(title, version.id)} 
                        className="cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800">
                        <Download />
                        Download
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        disabled={version.is_current}
                        onClick={() => setDialog(Dialogs.update)} 
                        className="cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800">
                        <LaptopMinimal />
                        Make current
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        onClick={() => setDialog(Dialogs.delete)}
                        className="cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 text-red-600">
                        <ListX />
                        Delete version
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ---- Dialog: Make Current ---- */}
            <Dialog open={dialog === Dialogs.update} onOpenChange={(open) => {if (!open) setDialog(null);}}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Set Version {version.version_number} as Current</DialogTitle>
                        <DialogDescription>
                            This will make this version the current active version.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant={"outline"} onClick={() => setDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={async() => {
                                setCurrentVersionAction(version.id, userId);
                                setDialog(null);
                                window.location.reload();
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ---- Dialog: Delete Version ---- */}
            <Dialog open={dialog === Dialogs.delete} onOpenChange={(open) => { if (!open) setDialog(null);}}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Delete Version {version.version_number}</DialogTitle>
                        <DialogDescription className="text-red-600 font-medium">
                            Are you sure? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant={"outline"} onClick={() => setDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant={"destructive"}
                            onClick={async() => {
                                deleteVersionAction(version.id, userId);
                                setDialog(null);
                                window.location.reload();
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}