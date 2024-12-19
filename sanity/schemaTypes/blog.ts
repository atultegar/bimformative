import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { authorType } from "./author";
import { format, parseISO } from "date-fns";
import { blockContentType } from "./blockContentType";

export const blogsType = defineType({
    name: 'blog',
    title: 'Blog',
    icon: DocumentTextIcon,
    type: 'document',
    fields: [
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Mark this blog as featured.',
            initialValue: false,
        }),
        defineField({
            name: 'title',
            title: 'Title of blog article',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug of your blog article',
            type: 'slug',
            description: "A slug is required for the post to show up in the preview",
            options : {
                source: 'title',
                maxLength: 96,
                isUnique: (value, context) => context.defaultIsUnique(value, context),
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'titleImage',
            title: 'Title Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative text",
                    description: "Important for SEO and accessibility.",
                    validation: (rule) => {
                        return rule.custom((alt, context) => {
                            if ((context.document?.picture as any)?.asset?._ref && !alt) {
                                return "Required";
                            }
                            return true;
                        });
                    },
                },
            ],
            validation: (rule) => rule.required(),
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
            of: [{type: 'block'}, {type: 'youtube'}, {type: 'code'}],
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{type: authorType.name}],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{type: "reference", to: [{ type: "tag"}] }],
        }),
    ],
    preview: {
        select: {
            title: "title",
            author: "author.name",
            date: "date",
            media: "titleImage",
        },
        prepare({ title, media, author, date }) {
            const subtitles = [
                author && `by ${author}`,
                date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
            ].filter(Boolean);

            return { title, media, subtitle: subtitles.join(" ")};
        },
    },
});