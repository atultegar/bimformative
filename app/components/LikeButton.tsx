"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { postLikeAction } from "../actions/serverActions";

type LikeButtonProps = {
    scriptId: string;
    userId: string;
    likesCount: number;
    likedByUser: boolean,
    variant?: "full" | "icon";
}

export default function LikeButton({
    scriptId,
    userId,
    likesCount,
    likedByUser,
    variant = "icon"
} : LikeButtonProps) {
    const [likes, setLikes] = useState<number>(likesCount);
    const [liked, setLiked] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    
    // Keep likes in sync when table data updates
    useEffect(() => {
        setLikes(likesCount);
        setLiked(likedByUser)
    }, [likesCount, likedByUser]);    
    
    const handleLike = () => {
        startTransition(async () => {
            const optimisticLiked = !liked;
            const optimisticLikes = likes + (optimisticLiked ? 1 : -1);

            setLiked(optimisticLiked);
            setLikes(optimisticLikes);

            try {
                const data = await postLikeAction(scriptId, userId);
                
                if (typeof data.likes === "number") {
                    setLikes(data.likes);
                }
                if (typeof data.liked === "boolean") {
                    setLiked(data.liked);
                }
            } catch (err) {
                console.error("Like failed", err);

                // Rollback optimistic update
                setLikes(likes);
                setLiked(liked);
            }
        });
    };

    const baseClasses = "transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out";

    // Full version
    if (variant === "full") {
        return (
            <Button
                variant={"secondary"}
                size={"sm"}
                onClick={handleLike}
                disabled={isPending}
                className={`${baseClasses} flex items-center gap-2`}>
                    <ThumbsUp
                        size={18}
                        className={liked ? "text-blue-600" : "text-gray-400"}
                    />
                    <span>Like</span>
                    <span className="text-xs bg-black/20 rounded px-1 pu-0.5">
                        {isPending ? "..." : likes}
                    </span>
            </Button>
        );
    }

    // Icon-only version
    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handleLike}
            disabled={isPending}
            className={`${baseClasses} relative flex items-center`}>
                <ThumbsUp
                    size={18}
                    className={liked ? "text-blue-600" : "text-gray-400"}
                />
                <span className="text-xs opacity-80">
                    {isPending ? "..." : likes}
                </span>
        </Button>
    );
}