import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons"

export const authorType = defineType({
    name: "author",
    title: "Author",
    icon: UserIcon,
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (rule) => rule.required(),
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
            validation: (rule) => rule.required(),
        }),
    ],
});