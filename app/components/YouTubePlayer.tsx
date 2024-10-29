"use client"

import React from 'react';
import ReactPlayer from 'react-player';

export function YouTubePlayer({url}: {url: string}) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            }}>
            <ReactPlayer url={url} controls />
        </div>        
    ) 
}