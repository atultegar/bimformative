import { defineField, defineType } from "sanity";

export const dynamoScriptType = defineType({
    name: 'dynamoscript',
    title: 'Dynamo Script',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title of Dynamo script',
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
            name: 'link',
            title: 'Link',
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