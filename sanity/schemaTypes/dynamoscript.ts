import { defineField, defineType } from "sanity";

export const dynamoScriptType = defineType({
    name: 'dynamoscript',
    title: 'Dynamo Script',
    type: 'document',
    fields: [
        defineField({
            name: 'scriptfile',
            title: 'Script File',
            type: 'file',
            fields: [
                {
                    name: 'description',
                    type: 'string',
                    title: 'Description'
                }
            ]
        }),
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
            name: 'youtubelink',
            title: 'YouTube Link',
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