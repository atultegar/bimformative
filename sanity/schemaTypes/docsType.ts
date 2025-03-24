import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const docsType = defineType({
    name: 'docs',
    title: 'Documentation',
    type: 'document',
    icon: BookIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{type: 'string'}],
        }),
    ]
})