"use client";
import { useEffect, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquareX } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { deleteCommentAction, getProfileByIdAction, getScriptCommentsAction, postScriptCommentsAction } from "../actions/serverActions";
import { Comment } from "@/lib/types/comment";

type CommentFormProps = {
    scriptId: string;
    userId: string | null;
}

export default function CommentForm( {scriptId, userId} : CommentFormProps) {
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    const [text, setText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [isPending, startTransition] = useTransition();
    
    const [currentUser, setCurrentUser] = useState<any>();
    

    // inital comments from script
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getScriptCommentsAction(scriptId);
                setComments(data);
            } catch (err) {
                console.error("Failed to load comments", err);
            }
        };

        const fetchUserProfile = async () => {
            if (!userId) return;

            try {
                const data = await getProfileByIdAction(userId);
                setCurrentUser(data);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            }
        };

        fetchComments();
        fetchUserProfile();
    }, [scriptId, userId])

    // ADD COMMENT
    const handleSubmit = () => {
        if (!userId) {
            router.push("/sign-in");
            return;
        }

        if (!text.trim()) return;

        const optimisticId = crypto.randomUUID();

        const optimisticComment: Comment = {
                id: optimisticId,
                script_id: scriptId,
                comment: text,
                user_id: userId,
                created_at: new Date().toISOString(),
                profiles: {
                    first_name: currentUser.first_name ?? "",
                    last_name: currentUser.last_name ?? "",
                    avatar_url: currentUser.avatar_url ?? "",
            },
        };

        setComments((prev) => [optimisticComment, ...prev]);
        setText("");

        startTransition(async () => {
            try {
                const saved = await postScriptCommentsAction(scriptId, userId, optimisticComment.comment);

                // Replace optimistic with server comment
                setComments((prev) =>
                    prev.map((c) => c.id !== optimisticId ? saved : c)
                );
            } catch (err) {
                console.error("Add comment failed", err);

                // Rollback
                setComments((prev) => 
                    prev.filter((c) => c.id !== optimisticId)
                );
            }
        });
    };

    // DELETE COMMENT
    const handleDelete = (commentId: string) => {
        if (!userId) return;

        const prevComments = comments;
        setComments((prev) => prev.filter((c) => c.id !== commentId));

        startTransition(async () => {
            try {
                const res = await deleteCommentAction(commentId, userId);

                if(!res) {
                    setComments(prevComments);
                }
            } catch (err) {
                console.error("Delete comment failed", err);

                // Rollback
                setComments(prevComments);
            }            
        });
    };

    return (
        <div className="py-5 flex-col items-center justify-self-center">
            <strong className="w-[800px]">
                Comments ({comments.length})
            </strong>

            <div className="flex items-start gap-5 mt-5">
                <Textarea 
                    placeholder={
                        userId 
                            ? "Type your comments here..." 
                            : "Sign in to write a comment" 
                    } 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    disabled={!userId} 
                />
                <Button 
                    variant={"secondary"} 
                    onClick={handleSubmit} 
                    disabled={isPending || !userId}
                >
                    {isPending ? "Posting..." : "Post"}
                </Button>
            </div>

            <div className="mt-5 border-b" />

            <div className="w-[800px]">
                {comments?.map((comment) => (
                    <div key={comment.id} className="mt-5">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={comment.profiles.avatar_url}/>
                                    <AvatarFallback>{(comment.profiles.first_name).slice(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <p>
                                        {comment.profiles.first_name}{" "}
                                        {comment.profiles.last_name}
                                    </p>
                                    <small className="text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </small>
                                </div>                              
                            </div>
                            <div>
                                {comment.user_id === userId && (
                                    <MessageSquareX 
                                        className="text-red-500 hover:opacity-50 hover:cursor-pointer" 
                                        onClick={() => handleDelete(comment.id)} 
                                    />
                                )}
                            </div>
                        </div>
                        
                        <div className="border-b py-2 ml-14">
                            <p className="ml-2">{comment.comment}</p>
                        </div>
                    </div>                    
                ))}
            </div>
        </div>
    );
}