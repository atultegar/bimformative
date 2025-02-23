import type { PreviewProps } from "sanity";
import { Box, Flex, Text } from '@sanity/ui';
import YouTubePlayer from 'react-player/youtube';
import ReactPlayer from "react-player";

export function YouTubePreview(props: PreviewProps) {
    const {title: url} = props;

    return (
        <div style={{ padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {typeof url == 'string'
            ? <ReactPlayer url={url} />
        : <Text>Add a YouTube URL</Text>}
        </div>
    )
}