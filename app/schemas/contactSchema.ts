import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  newsletter: z.boolean().optional(),
  turnstileToken: z.string().min(1, "Turnstile verification failed"),
});

export type ContactSchemaType = z.infer<typeof ContactSchema>;
