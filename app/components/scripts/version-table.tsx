"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, getSortedRowModel } from "@tanstack/react-table";
import { versionColumns} from "./version-columns";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitCompare } from "lucide-react";
import { ScriptVersion } from "@/app/lib/interface";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import CompareVersionDialog from "./CompareVersionDialog";
import { MinimalVersion } from "@/lib/types/version";

interface Props {
    title: string;
    versions: MinimalVersion[];
    currentUserId: string;
    canManageVersions: boolean;
}

export function VersionTable({ title, versions, currentUserId, canManageVersions }: Props) {
    const [rowSelection, setRowSelection] = React.useState({});

    const sortedVersions = React.useMemo(() => {
        return [...versions].sort((a, b) => b.version_number - a.version_number);
    }, [versions]);

    const table = useReactTable({
        data: sortedVersions,
        columns: versionColumns(title, canManageVersions, currentUserId),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
        state: { rowSelection },
        onRowSelectionChange: setRowSelection,
        getSortedRowModel: getSortedRowModel(),
    });

    const selectedVersions = table
        .getSelectedRowModel()
        .rows.map((r) => r.original);

    return (
        <div className="py-5 space-y-2">
            <Separator/>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={"ghost"}
                        disabled={selectedVersions.length !== 2}
                    >
                        <GitCompare /> Compare versions
                    </Button>
                </DialogTrigger>
                {selectedVersions.length === 2 ? (
                    <CompareVersionDialog scriptTitle={title} versions={selectedVersions} />
                ) : (
                    <div></div>
                )}
                
            </Dialog>            
            <Separator />
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            
        </div>
    );
}