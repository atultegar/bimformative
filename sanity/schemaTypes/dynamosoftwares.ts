import { defineField, defineType } from "sanity";

export const dynamosoftwares = defineType({
    name: 'dynamosoftwares',
    title: 'Dynamo Softwares',
    type: 'document',
    fields: [        
        defineField({
            name: 'name',
            title: 'Name of Software',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
        }),        
    ]
})