import { defineField, defineType } from "sanity";

export const roadmapItems = defineType({
    name: 'roadmapitems',
    title: 'Roadmap Items',
    type: 'document',
    fields: [
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
            name: 'type',
            title: 'Type',
            type: 'string',
            initialValue: 'addin',
            options: {
                list: [
                    { title: 'Add-in', value: 'addin'},
                    { title: 'Dynamo Script', value: 'dynamoscript'},
                    { title: 'Other', value: 'other'},
                ]
            }
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'number',
            description: '0: Planned, 1-99: In Progress, 100: Completed',
        }),
    ]
})