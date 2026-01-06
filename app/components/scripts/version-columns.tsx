import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import VersionActionMenu from "@/app/components/scripts/VersionActionMenu";
import { MinimalVersion } from "@/lib/types/version";
import VersionDownloadButton from "./VersionDownloadButton";

export const versionColumns = (title: string, canManageVersions: boolean, userId: string | null): ColumnDef<MinimalVersion>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox 
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "version_number",
        header: "Version",
        cell: ({ row }) => (
            <div className="items-center justify-center">
                <Badge variant={"outline"} className={`${row.original.is_current ? "text-primary" : "text-secondary-foreground"}`}>V{row.original.version_number}</Badge>
            </div>
            
        ),
    },
    {
        accessorKey: "changelog",
        header: "Change Log",
    },
    {
        accessorKey: "updated_at",
        header: "Updated at",
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);

            const formatted = date.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short"                
            });

            return formatted.replaceAll(",", "");
        }      
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const version = row.original;

            return canManageVersions ? (
                <VersionActionMenu title={title} version={version} userId={userId ?? ""} />
            ) 
            : (
                <VersionDownloadButton title={title} versionId={version.id} userId={userId} />
            );
        },
    },
];