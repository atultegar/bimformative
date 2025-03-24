import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FooterCTA() {
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gradient-to-b from-gray-100 dark:bg-black dark:from-black dark:to-stone-950">
            <h2 className="text-center text-3xl font-semibold">Have Ideas for the Future? Let&apos;s Shape it Together</h2>
            <p className="text-center mt-5 text-muted-foreground max-w-4xl justify-self-center">We&apos;re committed to building tools and resources that empower your BIM journey. If you have ideas, suggestions, or features you&apos;d like to see, we&apos;d love to hear from you!</p>            
            <p className="text-center mt-5 text-muted-foreground max-w-4xl justify-self-center">Explore our growing library of resources or send us a message with your suggestions for the future roadmap.</p>
            <div className="mt-5 space-x-10 justify-self-center">
                <Button className="w-[150px]" asChild>
                    <Link href="/resources">Explore Resources</Link>                
                </Button>
                <Button variant="outline" className="w-[150px]" asChild>
                    <Link href="/contact">Contact Us</Link>             
                </Button>
            </div>            
        </section>
    )
}