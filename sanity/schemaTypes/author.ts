import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons"

export const authorType = defineType({
    name: "author",
    title: "Author",
    icon: UserIcon,
    type: "document",
    fields: [
        defineField({
            name: "id",
            title: "Id",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "givenName",
            title: "Given Name",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "familyName",
            title: "Family Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "picture",
            title: "Picture",
            type: "image",
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative text",
                    description: "Important for SEO and accessibility.",
                    validation: (rule) => {
                        return rule.custom((alt, context) => {
                            if ((context.document?.picture as any)?.asset?._ref && !alt) {
                                return "Required";
                            }
                            return true;
                        });
                    },
                },
            ],
        }),
        defineField({
            name: "pictureurl",
            title: "Picture Url",
            type: "string",
        }),
    ],
    preview: {
                select: {
                    firstName: "givenName",
                    lastName: "familyName"
                },
                prepare({ firstName, lastName }) {
                    const title = `${firstName} ${lastName}`;
                    
                    return { title };
                },
            },
});