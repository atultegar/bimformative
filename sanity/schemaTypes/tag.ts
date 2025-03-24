import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tag = defineType({
    name: 'tag',
    title: 'Tag',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Tag Name',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: "name",
            },
        }),
    ],
});