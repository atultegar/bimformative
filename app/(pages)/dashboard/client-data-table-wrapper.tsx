"use client";

import { usercolumns } from "./usercolumns";
import { UserDataTable } from "./datatable";

export function ClientDataTable({ 
    data,
    currentUserId,
 }: {
    data: any[];
    currentUserId: string | null;
 }) {
    const resolvedColumns = usercolumns(currentUserId);
    return (
        <UserDataTable 
            data={data}
            columns={resolvedColumns}
        />
    );
}