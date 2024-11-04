import { defineField, defineType } from "sanity";
import { CodeIcon } from "@sanity/icons";

export const codeType = defineType({
    name: 'codeSnippet',
    title: 'Code Snippets',
    type: 'document',
    icon: CodeIcon,
    fields: [        
        defineField({
            name: 'title',
            title: 'Title of the script',
            type: 'string',
        }),
        defineField({
            name: 'codeField',
            title: 'Code Field',
            type: 'code',
        }),
    ]
})