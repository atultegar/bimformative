import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FooterCTA() {
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gradient-to-b from-gray-100 dark:bg-black dark:from-black dark:to-stone-950">
            <h2 className="text-center text-3xl font-semibold">Ready to dive in?</h2>
            <p className="text-center mt-5 text-gray-700">Start exploring BIMformative today.</p>            
            <Button className="mt-5 flex w-[150px] space-x-2 items-center mx-auto p-5 rounded-r-md" asChild>
                <Link href="/resources">Explore Resources</Link>                
            </Button>
        </section>
    )
}