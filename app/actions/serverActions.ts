"use server";

import { z } from "zod";
import { scriptFormSchema } from "../lib/zodSchemas";
import { client } from "../lib/sanity";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { comment } from "../lib/interface";
import { auth } from "@clerk/nextjs/server";

const FUNCTION_URL = process.env.AZURE_FUNCTION_URL;


export async function addScriptToDataset(
    data: z.infer<typeof scriptFormSchema>, 
    userId: string, 
    dynVersion: string, 
    dynPlayer:boolean, 
    pythonScripts:boolean, 
    externalPackages:string[],
    scriptViewData: string,){
    try {
        const file = data.scriptfile[0];
        const arrayBuffer = await file.arrayBuffer();
        const fileAsset = await client.assets.upload('file', Buffer.from(arrayBuffer), {filename: file.name});        

        const scriptType = await client.fetch(`*[_type == 'dynamosoftwares' && name == "${data.scripttype}"]`);
        const user = await client.fetch(`*[_type == 'author' && id == "${userId}"]`);

        if (fileAsset) {
            const scriptDoc = {
                _type: "dynamoscript",
                title: data.title,
                scriptfile: {
                    asset: {
                        _ref: fileAsset._id,
                    },                    
                },
                description: data.description,
                scripttype: {
                    _ref: scriptType[0]._id,
                },
                author: {
                    _ref: user[0]._id,
                },
                youtubelink: data.youtubevideo,
                tags: data.tags,
                dynamoversion: dynVersion,
                dynamoplayer: dynPlayer,
                pythonscripts: pythonScripts,
                externalpackages: externalPackages,
                scriptView: {
                    code: scriptViewData,
                    language: "json",
                }
            };
            const dynamoscriptDoc = await client.create(scriptDoc);
        }
        revalidatePath("/dashboard");
        return { success: true, message: {fileAsset}};
    } catch (error) {
        console.error("Error uploading script:", error);
        return {success: false, message: "Failed to upload script."};
    }
}

export async function updateScriptInDataset(data: any, scriptId: string) {
    // Update script in dataset
    try {
        const scriptType = await client.fetch(`*[_type == 'dynamosoftwares' && name == "${data.scripttype}"]`);
        const dynamoScriptDoc = await client.patch(scriptId).set({
            title:data.title, 
            scripttype: {
                _ref: scriptType[0]._id,
            }, 
            description: data.description, 
            youtubelink:data.youtubevideo, 
            tags:data.tags
        }).commit();
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Error updating script:", error);    
    }
}

export async function processDynFile(jsonContent: string) {
    if (!FUNCTION_URL) {
        throw new Error("Azure Function URL is not defined");
    }
    
    const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({jsonContent}),
    });

    return response.json();
}

export async function getFileDownloadUrl (fileUrl: string){
    if (!fileUrl){
        return {success: false, message: "No file URL provided"};
    }

    const { userId, redirectToSignIn } = await auth();

    if(!userId) return redirectToSignIn();

    return {success: true, fileUrl };

}

export async function updateDownloadCount(scriptId:string) {
    if(!scriptId) {
        alert("Script Id is required")
        return;
    }

    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        downloads,
        }`;

    const script = await client.fetch(query);

    if(!script) {
        alert("Script not found");
        return;
    }

    // Increment download count
    const newDownloadCount = (script.downloads || 0) + 1;
    await client.patch(scriptId).set({downloads: newDownloadCount}).commit();
    return newDownloadCount;
}

export async function updateLikeCount(scriptId: string) {
    const { userId, redirectToSignIn } = await auth();    

    if(!scriptId) {
        alert("Script Id is required")
        return;
    }

    if(!userId) return redirectToSignIn();

    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        likes,
        }`;

    const script = await client.fetch(query);

    if(!script) {
        console.error("Script not found");
        return;
    }

    const likedUsers = script.likes || [];
    const hasLiked = likedUsers.includes(userId)

    // Increment download count
    const updateLikes = hasLiked 
        ? likedUsers.filter((id: string) => id !== userId)
        : [...likedUsers, userId];

    await client.patch(scriptId).set({likes: updateLikes}).commit();

    return { likes: updateLikes.length, liked: !hasLiked };
}

export async function fetchScriptDownloadUrl(scriptId: string) {
    const { userId, redirectToSignIn } = await auth();

    if(!userId) return redirectToSignIn();

    // Fetch file URL from database
    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        "fileUrl": scriptfile.asset->url,
        }`;

    const script = await client.fetch(query);

    if(!script?.fileUrl) {
        alert("File not found");
    }

    return script.fileUrl;    
}

export async function deleteScriptById(scriptId: string) {
    const { userId, redirectToSignIn } = await auth();

    if(!userId) return redirectToSignIn();

    // Fetch Dynamo script
    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        _id,
        title,
        "authorId": author -> id,
        "fileAssetId": scriptfile.asset._ref
        }`;

    const script = await client.fetch(query);

    if (script.authorId === userId){
        await client.delete(script._id);
        await client.delete(script.fileAssetId);

        revalidatePath("/dashboard");
    } else {
        console.error("Unable to delete:");
    }   
}

export async function addComment(scriptId: string, text: string) {
    const { userId, redirectToSignIn } = await auth();

    if(!userId) return redirectToSignIn();
    const user = await client.fetch(`*[_type == 'author' && id == "${userId}"]`);

    const userPic = user[0].pictureurl;
    const userName = user[0].givenName + " " + user[0].familyName;

    const newCommentDoc = {
        _type: "comment",
        key: `${userId}-${Date.now()}`, // Unique key
        sanitydocid: scriptId,
        user: { _ref: user[0]._id, },
        text: text,
        timestamp: new Date().toISOString(),
    };

    const newComment =  await client.create(newCommentDoc);
    const newCommentLocal: comment = {
        userid: userId ? userId : "", 
        username: userName,
        userpicture: userPic,
        text: newCommentDoc.text, 
        timestamp: newCommentDoc.timestamp,
        id: newComment._id,} 
    console.log(newCommentLocal);

    await client.patch(scriptId).setIfMissing({ comments: [] }).append("comments", [{_ref: newComment._id}]).commit({autoGenerateArrayKeys: true});

    return newCommentLocal;
}

export async function deleteComment(scriptId: string, commentId: string) {
    
    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        comments,
        }`;

    const data = await client.fetch(query);
    const comment = data.comments.filter((comment: any) => comment._ref == commentId)[0];
    const commentToRemove = [`comments[_key=="${comment._key}"]`];

    await client.patch(scriptId).unset(commentToRemove).commit();
    await client.delete(commentId);

    console.log("Comment removed: ", comment._key);

    return comment;
}