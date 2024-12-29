import { defineField, defineType } from "sanity";
import { UserIcon, EnvelopeIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";

export const contactmessage = defineType({
    name: "contactmessage",
    title: "Contact Message",
    icon: EnvelopeIcon,
    type: "document",
    fields: [
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
        }),
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "subject",
            title: "Subject",
            type: "string",
        }),
        defineField({
            name: "message",
            title: "Message",
            type: "string",
        }),
        defineField({
            name: "newsletter",
            title: "Newsletter",
            type: "boolean",
        }),
    ],
    preview: {
            select: {
                title: "subject",
                author: "name",
                date: "createdAt",
            },
            prepare({ title, author, date }) {
                const subtitles = [
                    author && `by ${author}`,
                    date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
                ].filter(Boolean);
    
                return { title, subtitle: subtitles.join(" ")};
            },
        },
});