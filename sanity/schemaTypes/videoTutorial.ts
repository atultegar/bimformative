import { defineField, defineType } from "sanity";
import { YouTubePreview } from "./youTubeType/YouTubePreview";
import YouTubePlayer from "react-player/youtube";
import {youtubeInput} from 'sanity-plugin-youtube-input';
import { youTube } from "./youTubeType";

export const videoTutorial = defineType({
    name: 'videoTutorial',
    title: 'Video Tutorial',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),        
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'url',
            title: 'YouTube Video URL',
            type: 'youtubeVideo',
        }),
    ]
})