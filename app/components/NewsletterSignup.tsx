"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  FormEvent, useState } from "react";
import newsletterimage from "@/public/newsletter-image.png";
import Image from "next/image";
import { subscribeAction } from "../actions/serverActions";
import { toast } from "sonner";

export default function NewsletterSignup() {
    const [email, setEmail] = useState<string>("");
    const [status, setStatus] = useState<"success" | "error" | "loading" | "idle">("idle");
    const [responseMsg, setResponseMsg] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setStatus("loading");

        startTransition(async () => {
            try {
                const result = await subscribeAction(email);

                setStatus("success");
                setEmail("");
                setResponseMsg(result.message);
                
                toast.success(result.message);
                
            } catch (err: any) {
                setStatus("error")

                toast.error(err?.message === "INVALID_EMAIL" ? "Please enter a valid email address" : "Subscription failed");
            }
        });        
    };

    return (
        <section className="max-w-full mt-10 bg-gray-100 dark:bg-black justify-items-center items-center">
            <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center min-h-[300px]">
                <Image src = {newsletterimage} alt="newsletter image" width={300} className="col-span-1 lg:col-span-1 flex flex-col justify-self-center"/>
                
                <form className="flex items-center justify-self-center gap-4" onSubmit={handleSubscribe}>
                    
                    <div>
                        <h2 className="text-center text-3xl font-semibold max-w-xl">Stay Updated with BIMformative!</h2>
                        <p className="text-center mt-2 text-gray-700 max-w-xl">
                            Subscribe to our newsletter for the latest BIM insights and resources.
                        </p>
                        <div className="flex w-full max-w-md space-x-2 items-center mx-auto p-5">
                            <Input type="email" placeholder="Email" className="border rounded-l-md" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status == "loading"} />
                            <Button type="submit" disabled={isPending} className="rounded-r-md">{isPending ? "Subscribing..." : "Subscribe"}</Button>
                        </div>
                    </div>                                    
                </form>
            </div>            
        </section>        
    );
};