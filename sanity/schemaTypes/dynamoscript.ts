import { defineField, defineType } from "sanity";
import { dynamosoftwares } from "./dynamosoftwares";
import { CodeBlockIcon } from "@sanity/icons";

export const dynamoScriptType = defineType({
    name: 'dynamoscript',
    title: 'Dynamo Script',
    type: 'document',
    icon: CodeBlockIcon,
    fields: [
        defineField({
            name: 'scriptfile',
            title: 'Script File',
            type: 'file',
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
            name: 'scripttype',
            title: 'Script Type',
            type: 'reference',
            to: {type: "dynamosoftwares"}
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: {type: "author"}
        }),
        defineField({
            name: 'dynamoversion',
            title: 'Dynamo Version',
            type: 'string',
        }),
        defineField({
            name: 'dynamoplayer',
            title: 'Dynamo Player Ready',
            type: 'boolean',
        }),        
        defineField({
            name: 'pythonscripts',
            title: 'Python Scripts',
            type: 'boolean',
        }),
        defineField({
            name: 'externalpackages',
            title: 'External Packages',
            type: 'array',
            of: [{type: 'string'}],
        }),
        defineField({
            name: 'youtubelink',
            title: 'Demo Video Link',
            type: 'url',
        }),
        defineField({
            name: 'downloads',
            title: 'Downloads Count',
            type: 'number',
            initialValue: 0,
            validation: rule => rule.integer()
        }),
        defineField({
            name: 'likes',
            title: 'Likes',
            type: 'array',
            of: [{type: 'string'}],
        }),
        defineField({
            name: 'scriptView',
            title: 'Script View',
            type: 'code',
        }),        
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{type: 'string'}],
        }),
        defineField({
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{type: 'reference', to: {type:'comment'}}],
        }),
    ]
})