"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  FormEvent, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

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
            const response = await axios.post("api/subscribe", {email});

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
        <form className="max-w-7xl mx-auto mt-10 py-16 bg-gray-100 dark:bg-black" onSubmit={handleSubscribe}>
            <h2 className="text-center text-3xl font-semibold">Stay Updated with BIMformative</h2>
            <p className="text-center mt-2 text-gray-700">
                Subscribe to our newsletter for the latest BIM insights.
            </p>
            <div className="flex w-full max-w-md space-x-2 items-center mx-auto p-5">
                <Input type="email" placeholder="Email" className="border rounded-l-md" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status == "loading"} />
                <Button type="submit" className="rounded-r-md">Subscribe</Button>
            </div>
            {/* <div className="server-message pt-4 text-green-600">
                {status === "success" ? (
                    <p className="text-green-600">{responseMsg}</p>
                ): null}
                {status === "error" ? (
                    <p className="text-orange-600">{responseMsg}</p>
                ): null}
            </div> */}            
        </form>
    );
};