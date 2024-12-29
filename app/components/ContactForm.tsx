"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function ContactForm() {
    const [state, setState] = useState<{ 
        pending?: boolean; 
        success?: boolean; 
        error?: { [key: string]: string[] } | string; 
        message?: string;
    }>({});

    const [showAlert, setShowAlert] = useState(false); // For controlling the visibility of the alert

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
            newsletter: formData.get("newsletter") === "on",
        }

        setState({ pending: true });
        try {
            const response = await axios.post("api/message", data);
            let message = response.data.message || "Message sent successfully!";
            if (data.newsletter) {
            const subscribeResponse = await axios.post("api/subscribe", { email: data.email });
            message += ` ${subscribeResponse.data.message || "You've successfully subscribed!"}`;
            }
            setState({ pending: false, success: true, message });
            setShowAlert(true);
        } catch (err) {
            if (axios.isAxiosError(err)) {
            setState({
                pending: false,
                success: false,
                error: err.response?.data?.error || "Failed to send the message. Please try again."
            });
            } else {
            setState({
                pending: false,
                success: false,
                error: "Failed to send the message. Please try again."
            });
            }
            setShowAlert(true);
        }
    }

    return (
        <div className="relative">
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <Alert className={`w-full max-w-md ${state.success ? "bg-green-100" : "bg-red-100"}`}>
                        <div className="flex items-center space-x-4">
                            {state.success ? (
                                <CheckCircle2 className="text-green-600" size={24} />
                            ) : (
                                <AlertCircle className="text-red-600" size={24} />
                            )}
                            <div>
                                <AlertTitle className={`${state.success ? "text-green-600" : "text-red-600"}`}>
                                    {state.success ? "Success!" : "Error!"}
                                </AlertTitle>
                                <AlertDescription className="text-gray-700">
                                    {state.message || (typeof state.error === 'string' ? state.error : "An error occurred")}
                                </AlertDescription>
                            </div>
                        </div>
                        <Button variant="ghost" className="absolute top-2 right-2" onClick={() => setShowAlert(false)}>
                            Close
                        </Button>
                    </Alert>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" required />
                </div>
                <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" required />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="newsletter" name="newsletter" />
                    <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
                </div>
                <div>
                    <Button type="submit" disabled={state.pending}>
                        {state.pending ? "Sending..." : "Send Message"}
                    </Button>
                </div>
            </form>
        </div>
        
    );
}