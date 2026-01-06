"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { postLikeAction } from "../actions/serverActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SimpleTooltip from "@/components/ui/SimpleTooltip";

type LikeButtonProps = {
    scriptId: string;
    userId: string | null;
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
    const router = useRouter();
    const [likes, setLikes] = useState<number>(likesCount);
    const [liked, setLiked] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    
    // Keep likes in sync when table data updates
    useEffect(() => {
        setLikes(likesCount);
        setLiked(likedByUser)
    }, [likesCount, likedByUser]);    
    
    const handleLike = () => {
        if (!userId) {
            router.push("/sign-in?redirect_url=/resources/dynamo-script")
            return;
        }

        const prevLiked = liked;
        const prevLikes = likes;

        const optimisticLiked = !liked;
        const optimisticLikes = Math.max(
            0,
            likes + (optimisticLiked ? 1 : -1)
        );

        setLiked(optimisticLiked);
        setLikes(optimisticLikes);

        startTransition(async () => {

            try {
                const res = await postLikeAction(scriptId, userId);
                
                if (typeof res?.likes === "number") {
                    setLikes(res.likes);
                }
                if (typeof res?.liked === "boolean") {
                    setLiked(res.liked);
                }
            } catch (err) {
                toast.error(`Like failed: ${err}`);

                // Rollback optimistic update
                setLikes(prevLikes);
                setLiked(prevLiked);
            }
        });
    };

    const baseClasses = "transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out";

    // Full version
    const button = (
        <Button
            variant={variant === "full" ? "secondary" : "ghost"}
            size={variant === "full" ? "sm" : "icon"}
            onClick={handleLike}
            disabled={isPending}
            className="transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out flex items-center gap-2" >
                <ThumbsUp
                    size={18}
                    className={liked ? "text-blue-600" : "text-gray-400"}
                />
                {variant === "full" && <span>Like</span>}
                
                <span className="text-xs opacity-80">
                    {isPending ? "..." : likes}
                </span>
        </Button>
    )

    if (!userId) {
        return (
            <SimpleTooltip label="Sign-in to like this script">
                {button}
            </SimpleTooltip>
        );
    }

    return button;
}