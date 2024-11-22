import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title : "Docs"
}

export default function Docs() {
    return (
        <div className="min-h-[900px]">
            <h1 className="text-center">Hello from docs page</h1>
        </div>
        
    )
}