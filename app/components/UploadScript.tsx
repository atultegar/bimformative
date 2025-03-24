"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import UploadDialog from "./UploadDialog";
import { useState } from "react";

export default function UploadScript({userId}: {userId: string}) {
    const [open, setOpen] = useState(false);

    function closeDialogHandler() {
        setOpen(false);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="py-1">
                    <Button className="w-[100px]">
                        <Upload />
                        Upload
                    </Button>
                </div>                                        
            </DialogTrigger>
            <UploadDialog userId={userId} submitHandler={closeDialogHandler}/>
        </Dialog>
    )
}