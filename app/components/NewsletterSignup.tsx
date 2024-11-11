import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSignup() {
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gray-100 dark:bg-black">
            <h2 className="text-center text-3xl font-semibold">Stay Updated with BIMformative</h2>
            <p className="text-center mt-2 text-gray-700">
                Subscribe to our newsletter for the latest BIM insights.
            </p>
            <div className="flex w-full max-w-md space-x-2 items-center mx-auto p-5">
                <Input type="email" placeholder="Email" className="border rounded-l-md" />
                <Button type="submit" className="rounded-r-md">Subscribe</Button>
            </div>
        </section>
    )
}