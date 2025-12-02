"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Turnstile from "react-turnstile";

import { ContactSchema, ContactSchemaType } from "@/app/schemas/contactSchema";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { BackgroundCircles } from "./design/Hero";

export default function ContactForm() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    success: false,
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(form: ContactSchemaType) {
    if (!turnstileToken) {
      setAlertData({
        success: false,
        message: "Please verify you're human.",
      });
      setShowAlert(true);
      return;
    }

    form.turnstileToken = turnstileToken;

    try {
      // Send message
      const response = await axios.post("api/message", form);
      let finalMessage = response.data.message || "Message sent successfully!";

      // Newsletter subscription
      if (form.newsletter) {
        const subscribeResponse = await axios.post("api/subscribe", {
          email: form.email,
          turnstileToken,
        });

        finalMessage +=
          " " +
          (subscribeResponse.data.message ||
            "You've successfully subscribed!");
      }

      setAlertData({ success: true, message: finalMessage });
      setShowAlert(true);
    } catch (err: any) {
      setAlertData({
        success: false,
        message:
          err?.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
      setShowAlert(true);
    }
  }

  return (
    <div className="relative space-y-6">

      {/* Alerts */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Alert
            className={`w-full max-w-md ${
              alertData.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="flex items-center space-x-4">
              {alertData.success ? (
                <CheckCircle2 className="text-green-600" size={24} />
              ) : (
                <AlertCircle className="text-red-600" size={24} />
              )}

              <div>
                <AlertTitle
                  className={`${
                    alertData.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {alertData.success ? "Success!" : "Error!"}
                </AlertTitle>
                <AlertDescription className="text-gray-700">
                  {alertData.message}
                </AlertDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setShowAlert(false)}
            >
              Close
            </Button>
          </Alert>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
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
          <Textarea id="message" {...register("message")} />
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
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={(token) => {
              setTurnstileToken(token);
              setValue("turnstileToken", token);
            }}
          />
          {errors.turnstileToken && (
            <p className="text-red-600 text-sm">
              {errors.turnstileToken.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
      <BackgroundCircles />

    </div>
  );
}
