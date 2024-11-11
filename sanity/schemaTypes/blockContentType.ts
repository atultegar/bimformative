import { defineType, defineField, defineArrayMember} from 'sanity'

export const blockContentType = defineType({
    name: 'blockContent',
    type: 'array',
    title: 'Body',
    of: [
        defineArrayMember({
            type: 'block'
        }),
        defineArrayMember({
            type: 'youTube'
        }),
        defineArrayMember({
            type: 'code',
        }),
        defineArrayMember({
            type: 'image',
            options: {hotspot: true},
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
                {
                    name: 'height',
                    type: 'number',
                    title: 'Height',
                },
                {
                    name: 'width',
                    type: 'number',
                    title: 'Width',
                },
            ]
        }),
    ]
})