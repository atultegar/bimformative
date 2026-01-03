export type ContactPayload = {
    name: string;
    email: string;
    subject?: string;
    message: string;
    newsletter?: boolean;
    turnstileToken: string;
}