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

/* ------------------------------------------ */
/* TYPES */
/* ------------------------------------------ */
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page: number;
    limit: number;
    total: number;
}

/* ------------------------------------------ */
/* FILTERS */
/* ------------------------------------------ */
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
];

/* ------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------ */
export function DataTable<TData extends { title?: string; slug?: string }, TValue>({
    columns,
    data,
    page,
    limit,
    total,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ------------------------------------------ */
    /* Search State */
    /* ------------------------------------------ */
    const [searchInput, setSearchInput] = React.useState(searchParams.get("search") || "");
    const [suggestions, setSuggestions] = React.useState<{ title: string; slug: string;}[]>([]);

    const searchRef = React.useRef<HTMLDivElement>(null);

    /* ------------------------------------------ */
    /* Outside Click (SAFE) */
    /* ------------------------------------------ */
    
    React.useEffect(() => {
        if (suggestions.length === 0) return;
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (searchRef.current?.contains(target)) return;

            if (
                target.closest("[data-radix-portal]") ||
                target.closest("[role='dialog']") ||
                target.closest("[role='menu']")
            ) {
                return;
            }
            setSuggestions([]);
        };

        document.addEventListener("pointerdown", handleClickOutside, true);
        return () => {
            document.removeEventListener("pointerdown", handleClickOutside, true);
        };
    }, [suggestions.length]);

    /* ------------------------------------------ */
    /* Sync URL → Input */
    /* ------------------------------------------ */

    React.useEffect(() => {
        setSearchInput(searchParams.get("search") || "");
    }, [searchParams]);

    /* ------------------------------------------ */
    /* Pagination */
    /* ------------------------------------------ */    
    const totalPages = Math.max(1, Math.ceil(total / limit));
    
    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        params.set("limit", String(limit));
        router.push(`?${params.toString()}`);
    };

    /* ------------------------------------------ */
    /* URL Params Helper */
    /* ------------------------------------------ */ 
    const setParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        params.set("page", "1"); // reset to page 1 for new filters
        router.push(`?${params.toString()}`);
    };


    /* ------------------------------------------ */
    /* Search */
    /* ------------------------------------------ */ 
    const applySearch = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchInput.trim()) {
            params.set("search", searchInput.trim());
        } else {
            params.delete("search");
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const computedSuggestions = React.useMemo(() => {
        if (!searchInput.trim()) return [];

        const q = searchInput.toLowerCase();

        return data
            .filter((d: any) => 
                d.title?.toLowerCase().includes(q)
            )
            .slice(0, 5)
            .map((d: any) => ({
                title: d.title,
                slug: d.slug,
            }));
    }, [searchInput, data]);
    
    React.useEffect(() => {
        setSuggestions(computedSuggestions);
    }, [computedSuggestions]);

    /* ------------------------------------------ */
    /* Table */
    /* ------------------------------------------ */ 
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

    
    /* ------------------------------------------ */
    /* Render */
    /* ------------------------------------------ */ 
    return (
        <div className="space-y-4">
            {/* FILTER BAR */}
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    {/* SEARCH WRAPPER */}
                    <div ref={searchRef} className="relative w-full max-w-sm">
                        <div className="flex">
                            <Input
                                placeholder="Search scripts..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        applySearch();
                                    }
                                }}
                                className="rounded-r-none" 
                            />
                            <Button onClick={applySearch} className="rounded-l-none">
                                Search
                            </Button>
                        </div>

                        {/* SUGGESTIONS DROPDOWN */}
                        {suggestions.length > 0 && (
                            <div className="absolute z-20 mt-1 w-full rounded-md border bg-background shadow-lg">
                                <ul className="max-h-64 overflow-auto py-1 text-sm">
                                    {suggestions.map((s) => (
                                        <li
                                            key={s.slug}
                                            className="cursor-pointer px-3 py-2 hover:bg-muted"
                                            onClick={() => router.push(`/resources/dynamo-scripts/${s.slug}`)}                                 
                                        >
                                            <span className="font-medium">{s.title}</span>
                                        </li>
                                    ))}
                                </ul>                                
                            </div>
                        )}
                    </div>

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
            <div className="rounded-md border overflow-visible">
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="relative overflow-visible"
                            >
                                {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className="overflow-visible"
                                >
                                    {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                    )}
                                </TableCell>
                                ))}
                            </TableRow>
                            ))
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