import { defineField, defineType } from "sanity";

export const blogsType = defineType({
    name: 'blog',
    title: 'Blog',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title of blog article',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug of your blog article',
            type: 'slug',
            options : {
                source: 'title',
            },
        }),
        defineField({
            name: 'titleImage',
            title: 'Title Image',
            type: 'image',
        }),
        defineField({
            name: 'smallDescription',
            title: 'Small Description',
            type: 'text',
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{type: 'block'}],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{type: 'string'}],
        }),
    ]
})