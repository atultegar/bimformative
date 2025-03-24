import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppWindow, Download, Edit, MoreHorizontal, TriangleAlert } from "lucide-react";
import { deleteScript, handleScriptDownload } from "../actions/clientActions";
import DialogDetails from "./DialogDetails";
import { comment } from "../lib/interface";
import { useState } from "react";
import DialogEdit from "./DialogEdit";
import DialogDelete from "./DialogDelete";

type DynamoScript = {
     _id: string
        title: string
    scripttype: string
    dynamoplayer: boolean
    externalpackages: string[]
    pythonscripts: boolean
    fileUrl: string
    description: string
    youtubelink: string
    image: string
    code: string
    author: string
    authorPicture: string
    downloads: number
    likes: string[]
    dynamoversion: string
    tags: string[]
    comments: comment[]
}

export default function UserActionMenu({script}: {script: DynamoScript}) {
    enum Dialogs {
        details = "detailDialog",
        edit = "editDialog",
        delete = "deleteDialog",
    }

    const [dialog, setDialog] = useState<Dialogs | undefined>();
    const [open, setOpen] = useState(false);

    function closeDialogHandler() {
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                    <DialogTrigger 
                        asChild
                        onClick={() => setDialog(Dialogs.details)}>
                        <DropdownMenuItem>
                            <AppWindow />
                            Details
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTrigger 
                        asChild
                        onClick={() => setDialog(Dialogs.edit)}>
                        <DropdownMenuItem>
                            <Edit />
                            Edit
                        </DropdownMenuItem>
                    </DialogTrigger>                    
                    <DropdownMenuItem onClick={() => handleScriptDownload(script._id)}>
                        <Download />
                        Download
                    </DropdownMenuItem>
                    <DialogTrigger 
                        asChild
                        onClick={() => setDialog(Dialogs.delete)}>
                        <DropdownMenuItem>
                            <TriangleAlert />
                            Delete
                        </DropdownMenuItem>
                    </DialogTrigger>                    
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent >
                {(() => {
                    switch (dialog) {
                        case Dialogs.details:
                            return <DialogDetails script={script} />;
                        case Dialogs.edit:
                            return <DialogEdit script={script} submitHandler={closeDialogHandler}/>;
                        case Dialogs.delete:
                            return <DialogDelete script={script} submitHandler={closeDialogHandler} />;
                        default:
                            return <DialogDetails script={script} />;
                    }
                })()}
            </DialogContent>
            {/* <DialogDetails script={script} /> */}
        </Dialog>
    )
}