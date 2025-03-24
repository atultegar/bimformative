import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DynamoScript } from "../resources/dynamo-scripts/columns";
import { Button } from "@/components/ui/button";
import { deleteScript } from "../actions/clientActions";
import { useState } from "react";
import { set } from "zod";

export default function DialogDelete({script, submitHandler}: {script: DynamoScript, submitHandler: () => void}) {
    const [pending, setPending] = useState(false);
    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete Script</DialogTitle>            
            </DialogHeader>
            <DialogDescription>Are you sure want to delete this script?</DialogDescription>
            <DialogFooter>
                <Button
                    variant={"destructive"}
                    onClick={async () => {
                        setPending(true);
                        await deleteScript(script._id);
                        setPending(false);
                        submitHandler();
                    }}
                    disabled={pending}
                >
                    {pending ? "Deleting..." : "Yes"}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">No</Button>
                </DialogClose>
            </DialogFooter>
        </>        
    )
}