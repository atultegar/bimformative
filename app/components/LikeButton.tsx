"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { updateLikeCount } from "../actions/serverActions";

export default function LikeButton({script } : {script: any}) {
    const [likes, setLikes] = useState<number>(script.likes?.length);
    const [liked, setLiked] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {
        setLikes(script.likes?.length);
        setLiked(true);
    }, [script.likes?.length]);

    const handleLike = () => {
        startTransition(async () => {
            try {
                const result = await updateLikeCount(script._id);
                setLikes(result?.likes);
                if (result) {
                    setLiked(result.liked);
                }
            } catch (error) {
                console.error("Error toggling like.", error);
            }
        })
    };

    return (
        <Button
            variant={"ghost"}
            size={"default"}
            onClick={handleLike}
            disabled={isPending}
            className="text-md transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out">
                <ThumbsUp color={ liked ? "#4267B2" : "gray" } />
                {isPending ? "..." : likes}
        </Button>
    )
}