import { Metadata } from "next"
import React from "react"
import { PageBanner } from "../components/PageBanner"
import Link from "next/link"
import docsCover from "@/public/docs-cover.png";

export const metadata: Metadata = {
    title : "Docs"
}

const docsLinks = [
    { name: "CivilConnection", url: "https://docs.bimformative.com/civilconnection/" },
]

export default function Docs() {
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner imageSrc={docsCover} title="Documentation" description="Explore the guides and documentation for BIM workflows." />
            <div className="container mx-auto py-10">
                <ul className="space-y-4">
                    {docsLinks.map((doc, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <Link href={doc.url} target="_blank" className="text-lg text-blue-600 hover:underline">
                                {doc.name}                            
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>
        </section>        
    );
};