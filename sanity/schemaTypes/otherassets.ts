import { defineField, defineType } from "sanity";
import { dynamosoftwares } from "./dynamosoftwares";

export const otherAssets = defineType({
    name: 'otherassets',
    title: 'Other Assets',
    type: 'document',
    fields: [
        defineField({
            name: 'file',
            title: 'File',
            type: 'file',
        }),
        defineField({
            name: 'title',
            title: 'Title',
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
            name: 'assettype',
            title: 'Asset Type',
            type: 'string',
            initialValue: 'subassembly',
            options: {
                list: [
                    { title: 'Subassembly', value: 'subassembly'},
                    { title: 'Revit Family', value: 'revitfamily'},
                    { title: 'Excel Sheet', value: 'excelsheet'},
                    { title: 'Lisp', value: 'lisp'},
                ]
            }
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