"use server";

import { z } from "zod";

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required'),
});

export async function submitContactForm(prevState: any, formData: FormData) {
    if (!formData) {
        return {
            success: false,
            error: 'No form data received',
        };
    }
    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message: 'Thank you for your message. We\'ll be in touch soon!',
    };
}