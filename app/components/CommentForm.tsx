"use client";
import { useEffect, useState, useTransition } from "react";
import { addComment } from "../actions/serverActions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { comment } from "../lib/interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquareX } from "lucide-react";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function CommentForm( {script} : {script: any}) {
    const [text, setText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [comments, setComments] = useState<any[]>([]);
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        const sortedComments = script.comments?.sort((a:comment, b:comment) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setComments(sortedComments);
    }, [script.comments])

    const handleSubmit = () => {
        if(isSignedIn) {
            startTransition(async () => {
                if (text.trim() === "") return;
                const newComment = await addComment(script._id, text);
                setText(""); //Clear input after submission
                if (newComment) {
                    setComments([newComment, ...(comments || [])]);
                }            
            });
        } else {
            if(window.confirm("You need to login to comment")) {
                return redirect("/api/auth/login");
            }
        }        
    };

    return (
        <>
            <strong className="w-[250px]">Comments ({comments?.length || 0}):</strong>
            <div className="flex items-start gap-5 max-w-3xl mt-5">
                <Textarea placeholder="Type your comments here." value={text} onChange={(e) => setText(e.target.value)} />
                <Button variant={"secondary"} onClick={handleSubmit} disabled={isPending}>
                    {isPending ? "Submitting..." : "Post Comment"}
                </Button>
            </div>
            <div className="mt-5 border-b w-[800px]"></div>
            <div className="w-[800px]">
                {comments?.map((comment, index) => (
                    <div key={index} className="mt-5">
                        <div className="flex justify-between">
                            <div className="flex flex-row items-center gap-5">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={comment.userpicture}/>
                                    <AvatarFallback>{(comment.username).slice(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p>{comment.username}</p>
                                    <small className="text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</small>
                                </div>                              
                            </div>
                            <div>
                                {comment.userid === user?.id ? (
                                    <MessageSquareX color="red" className="hover:opacity-50 hover:cursor-pointer" />
                                ) : null}
                            </div>
                        </div>
                        
                        <div className="border-b py-2">
                            <p className="ml-2">{comment.text}</p>
                        </div>
                    </div>                    
                ))}
            </div>            

        </>
        
    )

}