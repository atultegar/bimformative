"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export function ClientDataTable({ 
    data, 
    page, 
    limit, 
    total, 
    currentUserId,
 }: {
    data: any[];
    page: number;
    limit: number;
    total: number;
    currentUserId: string;
 }) {
    const resolvedColumns = columns(currentUserId);
    return (
        <DataTable 
            data={data}
            page={page}
            limit={limit} 
            total={total} 
            columns={resolvedColumns}
        />
    );
}