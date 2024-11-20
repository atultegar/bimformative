"use client";

import * as React from "react";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, CircleOff, HelpCircle, Timer, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export const types = [
    {
        value: "revit",
        label: "Revit",
        icon: CheckCircle,
    },
    {
        value: "civil3d",
        label: "Civil 3D",
        icon: Timer,
    },

]

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            columnFilters,
        },
    });
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter scripts..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                        className="max-w-sm" />
                        {table.getColumn("scripttype") && (
                            <DataTableFacetedFilter column={table.getColumn("scripttype")}
                            title="Type"
                            options={types} />
                        )}
                        {isFiltered && (
                            <Button
                                variant="ghost"
                                onClick={() => table.resetColumnFilters()}
                                className="h-8 px-2 lg:px-3">
                                    Reset
                                    <X />
                            </Button>
                        )}
                </div>
            </div>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}
                                data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell)=> (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                        Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                        Next
                </Button>            
            </div>
        </div>        
    )
}