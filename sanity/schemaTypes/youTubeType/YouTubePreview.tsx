import type { PreviewProps } from "sanity";

export function YouTubePreview(props: PreviewProps) {
  const url = typeof props.title === "string" ? props.title : null;

  if (!url) {
    return (
      <div style={{ padding: 8, fontSize: 12, opacity: 0.6 }}>
        Add a YouTube URL
      </div>
    );
  }

  // Convert standard YouTube URL → embed URL
  const videoIdMatch =
    url.match(/v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/);

  const videoId = videoIdMatch?.[1];

  if (!videoId) {
    return (
      <div style={{ padding: 8, fontSize: 12, color: "red" }}>
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <iframe
        width="100%"
        height="180"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube preview"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}