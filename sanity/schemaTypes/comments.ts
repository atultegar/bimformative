import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const commentsType = defineType({
    name: 'comment',
    title: 'Comment',
    type: 'document',
    icon: CommentIcon,
    fields: [
        defineField({
            name: 'key',
            title: 'Key',
            type: 'string',
        }),
        defineField({
            name: 'sanitydocid',
            title: "Doc Id",
            type: "string",
        }),
        defineField({
            name: 'user',
            title: "User",
            type: "reference",
            to: {type: "author"}
        }),
        defineField({
            name: 'text',
            title: 'Text',
            type: 'text',
        }),
        defineField({
            name: 'timestamp',
            title: 'Timestamp',
            type: 'datetime',
        }),        
    ],
    preview: {
        select: {
            timestamp: "timestamp"
        },
        prepare({ timestamp }) {
            const title = `${timestamp}`;
            
            return { title };
        },
    },
})