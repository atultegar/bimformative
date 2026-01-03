import { defineType, defineField } from 'sanity';
import { PlayIcon } from "@sanity/icons"
import { YouTubePreview } from './YouTubePreview';


export default{
    name: "youtube",
    type: "string",
    title: "YouTube URL",
    icon: PlayIcon,
    preview: {
        select: {
            title: "."
        }
    },
    components: {
        preview: YouTubePreview,
    },
}