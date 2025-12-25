"use client";
import { useEffect, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquareX } from "lucide-react";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { deleteCommentAction, getProfileByIdAction, getScriptCommentsAction, postScriptCommentsAction } from "../actions/serverActions";
import { Comment } from "@/lib/types/comment";

type CommentFormProps = {
    scriptId: string;
    userId: string;
}

export default function CommentForm( {scriptId, userId} : CommentFormProps) {
    const [text, setText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [comments, setComments] = useState<Comment[]>([]);
    const { isSignedIn, user } = useUser();
    const [currentUser, setCurrentUser] = useState<any>();
    

    // inital comments from script
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getScriptCommentsAction(scriptId);

                setComments(data);
            } catch {

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
        if (!text.trim() || !userId || !currentUser) return;

        startTransition(async () => {
            const optimisticComment: Comment = {
                id: crypto.randomUUID(),
                script_id: scriptId,
                comment: text,
                user_id: userId,
                created_at: new Date().toISOString(),
                profiles: {
                    first_name: currentUser.first_name ?? "",
                    last_name: currentUser.lastName ?? "",
                    avatar_url: currentUser.avatar_url ?? "",
                }
            };

            setComments((prev) => [optimisticComment, ...prev]);
            setText("");

            try {
                const data = await postScriptCommentsAction(scriptId, userId, text);

                // Replace optimistic with server comment
                setComments((prev) =>
                    prev.map((c) => c.id !== optimisticComment.id ? data : c)
                );
            } catch (err) {
                console.error("Add comment failed", err);

                // Rollback
                setComments((prev) => 
                    prev.filter((c) => c.id !== optimisticComment.id)
                );
            }
        });
    };

    // DELETE COMMENT
    const handleDelete = (commentId: string, userId: string) => {
        startTransition(async () => {
            // Delete comment
            const prevComments = comments;
            setComments((prev) => prev.filter((c) => c.id !== commentId));

            try {
                const res = await deleteCommentAction(commentId, userId);

                if(!res) {
                    console.error("Delete comment failed.")
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

            <div className="flex items-start gap-5 max-w-3xl mt-5 w-full">
                <Textarea 
                    placeholder="Type your comments here." 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                />
                <Button 
                    variant={"secondary"} 
                    onClick={handleSubmit} 
                    disabled={isPending}
                >
                    {isPending ? "Posting..." : "Post"}
                </Button>
            </div>

            <div className="mt-5 border-b w-[800px]"></div>

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
                                    <p>{comment.profiles.first_name} {comment.profiles.last_name}</p>
                                    <small className="text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </small>
                                </div>                              
                            </div>
                            <div>
                                {comment.user_id === userId && (
                                    <MessageSquareX 
                                        className="text-red-500 hover:opacity-50 hover:cursor-pointer" 
                                        onClick={() => handleDelete(comment.id, userId)} 
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