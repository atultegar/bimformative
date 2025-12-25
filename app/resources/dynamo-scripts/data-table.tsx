"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/app/components/DataTableFacetedFilter";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { SiAutodeskrevit, SiAutocad } from "react-icons/si";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page: number;
    limit: number;
    total: number;
}

export const types = [
    {
        value: "revit",
        label: "Revit",
        icon: SiAutodeskrevit,
    },
    {
        value: "civil3d",
        label: "Civil 3D",
        icon: SiAutocad,
    },
]

export function DataTable<TData, TValue>({
    columns,
    data,
    page,
    limit,
    total,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Update URL parameters helper
    const setParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        params.set("page", "1"); // reset to page 1 for new filters
        router.push(`?${params.toString()}`);
    };

    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        params.set("limit", String(limit));
        router.push(`?${params.toString()}`);
    };

    // Table (no client pagination)
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: totalPages,
    });

    const isFiltered = 
        searchParams.get("search") ||
        searchParams.get("type");

    return (
        <div className="space-y-4">
            {/* FILTER BAR */}
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    {/* Search Input */}
                    <Input
                        placeholder="Search scripts..."
                        value={searchParams.get("search") || ""}
                        onChange={(e) => setParam("search", e.target.value)}
                        className="max-w-sm" 
                    />

                    {/* Script Type DropDown */}
                    <DataTableFacetedFilter 
                        column={table.getColumn("script_type")}
                        title="Type"
                        options={types}
                        onSelect={(value) => setParam("type", value )}
                        selectedValue={searchParams.get("type") || ""}
                    />

                    {/* Reset */}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => router.push("?page=1")}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}  
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-md border">
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
                        {data.length ? (
                            data.map((row: any, i: number) => {
                                const rowModel = table.getRowModel().rows[i];
                                return (
                                    <TableRow key={row.id || i}>
                                        {rowModel?.getVisibleCells().map(
                                            (cell: any)=> (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell, 
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}                        
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}            
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {total} total scripts
                </div>

                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {page} of {totalPages}
                </div>

                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={page <= 1}
                >
                    <ChevronsLeft />
                </Button>

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft />
                </Button>

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    <ChevronRight />
                </Button>

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 lg:flex"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={page >= totalPages}
                >
                    <ChevronsRight />
                </Button>   
            </div>
        </div>        
    );
}