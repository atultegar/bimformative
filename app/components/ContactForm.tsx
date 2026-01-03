"use client";

import { useEffect, useState } from "react";
import Turnstile from "react-turnstile";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { BackgroundCircles } from "./design/Hero";
import { submitContactAction } from "../actions/serverActions";
import { toast, Toaster } from "sonner";
import { ContactPayload } from "@/lib/types/contact";
import { useForm } from "react-hook-form";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactPayload>({
    defaultValues: {
      newsletter: false,
    }
  });

  async function onSubmit(data: ContactPayload) {
    setLoading(true);

    const result = await submitContactAction(data);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error ?? "Something went wrong");
      return;
    }

    toast.success(result.message ?? "Message sent successfully!");
    reset();
  }

  return (
    <div className="relative space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name", { required: "Name is required" })} />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register("subject")} />
          {errors.subject && (
            <p className="text-red-600 text-sm">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" {...register("message", { required: "Message is required" })} />
          {errors.message && (
            <p className="text-red-600 text-sm">{errors.message.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="newsletter"
            onCheckedChange={(checked) => setValue("newsletter", checked)}
          />
          <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
        </div>

        {/* Turnstile CAPTCHA */}
        <div>
          {process.env.NODE_ENV === "production" ? (
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onVerify={(token) => {
                setValue("turnstileToken", token, { shouldValidate: true });
              }}
            />
          ) : (
            <>
              {/* DEV MODE: inject token into RHF */}
              {useEffect(() => {
                setValue("turnstileToken", "dev-bypass", { shouldValidate: true });
              }, [])}
            </>            
          )}          
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
      <BackgroundCircles />

    </div>
  );
}
