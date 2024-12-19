"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  FormEvent, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import newsletterimage from "@/public/newsletter-image.png";
import Image from "next/image";

export default function NewsletterSignup() {
    const [email, setEmail] = useState<string>("");
    const [status, setStatus] = useState<"success" | "error" | "loading" | "idle">("idle");
    const [responseMsg, setResponseMsg] = useState<string>("");
    const [statusCode, setStatusCode] = useState<number>();
    const { toast } = useToast();

    async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await axios.post("api/kitSubscribe", {email});

            setStatus("success");
            setStatusCode(response.status);
            setEmail("");
            setResponseMsg(response.data.message);
            
            toast({
                description: response.data.message || "You've successfully subscribed!",
            });
            
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setStatus("error");
                setStatusCode(err.response?.status);
                setResponseMsg(err.response?.data.error);

                toast({
                    description: err.response?.data?.error || "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        };
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
                            <Button type="submit" className="rounded-r-md">Subscribe</Button>
                        </div>
                    </div>                                    
                </form>

            </div>
            
        </section>
        
    );
};