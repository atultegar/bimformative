"use server";

import { z } from "zod";
import { scriptFormSchema } from "../lib/zodSchemas";
import { client } from "../lib/sanity";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase/server";
import { deleteScript, getScriptById, getScriptsCount, patchScript, publishScript, publishVersion, scriptDownload, scriptDownloadUrlOnly, scriptLikedByUserId, updateScriptPrivate, updateScriptPublic } from "@/lib/services/scripts.service";
import { getResourcesCount, getRoadmapItems } from "@/lib/services/sanity.service";
import { ResourceCounts, RoadmapItem } from "@/lib/types/resources";
import { Comment } from "@/lib/types/comment";
import { deleteComment, getCommentsByScriptId, postCommentByScriptId } from "@/lib/services/comments.service";
import { getProfileById } from "@/lib/services/profiles.service";
import { deleteAllVersions, deleteVersion, getAllVersions, getVersionById, setCurrentVersion } from "@/lib/services/versions.service";
import { MinimalVersion } from "@/lib/types/version";
import { deleteLike, postLike } from "@/lib/services/likes.service";
import { PublishScriptInput, ScriptUpdate } from "@/lib/types/script";
import { analyzeDynamoJson, parseDynamoJsonFromFile } from "@/lib/services/dynalyzer.service";
import { subscribeToKit } from "@/lib/services/kit.service";
import { ContactPayload } from "@/lib/types/contact";
import { headers } from "next/headers";
import { submitContactMessage } from "@/lib/services/contact.service";
import { toast } from "sonner";


const FUNCTION_URL = process.env.AZURE_FUNCTION_URL;
const DEV_BYPASS = process.env.NODE_ENV === "development";
const DEV_USER_ID = process.env.DEV_FAKE_USER_ID as string ?? "dev-user";

async function getCurrentUserId(): Promise<string> {
    if (DEV_BYPASS) {
        return DEV_USER_ID;
    }

    const { userId } = await auth();
    if (!userId) {
        return "guest";
    }
    return userId;
}


export async function addScriptToDataset(
    data: z.infer<typeof scriptFormSchema>, 
    userId: string, 
    dynVersion: string, 
    dynPlayer:boolean, 
    pythonScripts:boolean, 
    externalPackages:string[],
    scriptViewData: string,){
    try {
        const file = data.scriptFile[0];
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
        toast.warning("Script Id is required")
        return;
    }

    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        downloads,
        }`;

    const script = await client.fetch(query);

    if(!script) {
        toast.warning("Script not found");
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
        toast.warning("Script Id is required")
        return;
    }

    if(!userId) return redirectToSignIn();

    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
        likes,
        }`;

    const script = await client.fetch(query);

    if(!script) {
        toast.warning("Script not found");
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
        toast.error("File not found");
        return;
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

export async function AddComment(userId: string, scriptId: string, comment: string) {
    if(!userId || !scriptId) {
        throw new Error("Missing userId or scriptId");
    }

    const supabase = await supabaseServer();

    // 1. Ensure script exists
    const {error: scriptError} = await supabase
        .from("dynscripts")
        .select("*")
        .eq("id", scriptId)
        .single();

    if (scriptError) {
        throw new Error("Script not found");
    }

    // insert comment
    const { data, error} = await supabase
        .from("script_comments")
        .insert({
            script_id: scriptId,
            user_id: userId,
            comment: comment.trim(),
        })
        .select()
        .single();

    if (error) {
        throw new Error("Failed to add comment");
    }

    return {comment: data};
}


export async function LikeScript(userId: string, scriptId: string) {    
    
    if(!userId || !scriptId) {
        throw new Error("Missing userId or scriptId");
    }

    const supabase = await supabaseServer();

    // 1. Ensure script exists
    const { data: script, error: scriptError} = await supabase
        .from("dynscripts")
        .select("*")
        .eq("id", scriptId)
        .single();

    if (scriptError || !script) {
        throw new Error("Script not found");
    }

    // 2. Check if user already liked this script
    const { data: existingLike } = await supabase
        .from("script_likes")
        .select("id")
        .eq("script_id", scriptId)
        .eq("user_id", userId)
        .single();

    let liked: boolean;

    if (existingLike) {
        // 3.a UNLIKE        
        await supabase
            .from("script_likes")
            .delete()
            .eq("id", existingLike.id);

        liked = false;
    } else {
        // 3b. LIKE
        await supabase
            .from("script_likes")
            .insert({
                script_id: scriptId,
                user_id: userId,
            });

        liked = true;
    }

    // 4. Get updated likes count
    const { count } = await supabase
        .from("script_likes")
        .select("*", { count: "exact", head: true })
        .eq("script_id", scriptId);

    return {liked, likes: count ?? 0};
}

// NEW ACTIONS - using Supabase
export async function downloadScriptAction(userId: string, slug: string) {
    if (!userId) throw new Error("UNAUTHORIZED");

    const { stream, filename } = await scriptDownload(slug, userId);

    return new Response(stream, {
        headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}

// SCRIPT DOWNLOAD URL
export async function getDownloadUrl(userId: string, slug: string) {
    const { signedUrl, filename } = await scriptDownloadUrlOnly(userId, slug);

    console.log(filename);

    return {
        url: signedUrl,
        filename,
    };
}

// RESOURCE COUNT
export async function getResourceCounts(): Promise<ResourceCounts> {
    const [ 
        sanityCounts, 
        scriptCount
    ] = await Promise.all([
        getResourcesCount(), // from Sanity
        getScriptsCount(),   // from Supabase
    ]);
    
    return {
        blogCount: sanityCounts.blogs ?? 0,
        docCount: sanityCounts.docs ?? 0,
        tutorialCount: sanityCounts.tutorials ?? 0,
        codeSnippetCount: sanityCounts.codeSnippets ?? 0,
        otherAssetCount: sanityCounts.otherAssets ?? 0,
        dynamoScriptCount: scriptCount ?? 0,
    };
}

// ROADMAP ITEMS
export async function getRoadmapItemsAction(): Promise<RoadmapItem[]>  {
    const roadmapItems = await getRoadmapItems();

    return roadmapItems;
}

// COMMENTS BY SCRIPT
export async function getScriptCommentsAction(scriptId: string): Promise<Comment[]> {
    const comments = await getCommentsByScriptId(scriptId);

    if (!comments) return [];

    // Normalize comments to match the Comment type: take the first profile entry (if any)
    return comments.map((c: any) => {
        const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
        return {
            id: c.id,
            script_id: c.script_id,
            user_id: c.user_id,
            comment: c.comment,
            created_at: c.created_at,
            profiles: {
                first_name: profile?.first_name ?? "",
                last_name: profile?.last_name ?? "",
                avatar_url: profile?.avatar_url ?? "",
            },
        } as Comment;
    });
}

// POST COMMENT
export async function postScriptCommentsAction(scriptId: string, userId: string, comment: string): Promise<Comment> {
    const res = await postCommentByScriptId(scriptId, userId, comment);

    const profiles = res.profiles;
    return {
        id: res.id,
        script_id: res.script_id,
        user_id: res.user_id,
        comment: res.comment,
        created_at: res.created_at,
        profiles: {
            first_name: profiles?.first_name ?? "",
            last_name: profiles?.last_name ?? "",
            avatar_url: profiles?.avatar_url ?? "", 
        },
    } as Comment;
}

// DELETE COMMENT
export async function deleteCommentAction(commentId: string, userId: string) {
    const res = await deleteComment(commentId, userId);

    if (!res) return "FORBIDDEN";

    return res;
}

// GET PROFILE BY ID
export async function getProfileByIdAction(profileId: string) {
    const profile = await getProfileById(profileId);

    if (!profile) return null;

    return profile;
}

// GET SCRIPT by ID
export async function getScriptByIdAction(scriptId: string) {
    return await getScriptById(scriptId);
}

// GET SCRIPT VERSIONS
export async function getScriptVersionsAction(scriptId: string): Promise<MinimalVersion[]> {
    const versions = await getAllVersions(scriptId);

    if (versions.length < 1) return [];

    return versions;
}

// GET VERSION BY ID
export async function getVersionByIdAction(versionId: string) {
    const version = await getVersionById(versionId);

    if (!version) return null;

    return version;
}

// SET CURRENT VERSION
export async function setCurrentVersionAction(versionId: string, userId: string) {
    const res = await setCurrentVersion(versionId, userId);

    return res;
}

// DELETE VERSION BY ID
export async function deleteVersionAction(versionId: string, userId: string) {
    const res = await deleteVersion(versionId, userId);

    return res; 
}

// POST OR REMOVE SCRIPT LIKE
export async function postLikeAction(scriptId: string, userId: string) {
    const likedByUser = await scriptLikedByUserId(userId, scriptId);

    if (!likedByUser) {
        const res = await postLike(scriptId, userId);
        return res;
    }

    const deleteRes = await deleteLike(scriptId, userId);
    return deleteRes;
}

// UPDATE SCRIPT STATUS
export async function updateScriptStatusAction(scriptId: string, isPublic: boolean) {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("UNAUTHORIZED");

    if (isPublic) {
        const res = await updateScriptPrivate(scriptId, userId);
        return res.message;
    }

    const publicRes = await updateScriptPublic(scriptId, userId);
    return publicRes.message;
}

// UPDATE SCRIPT DATA
export async function updateScriptAction(scriptId: string, payload: ScriptUpdate) {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("UNAUTHORIZED");

    await patchScript(scriptId, userId, payload);

    revalidatePath("/dashboard");

    return "SUCCESS"; 
}

// ANALYZE SCRIPT FILE
export async function analyzeDynamoFileAction(file: File) {
    const userId = await getCurrentUserId();

    if (!userId) throw new Error("UNAUTHORIZED");

    const parsedJson = await parseDynamoJsonFromFile(file);
    return analyzeDynamoJson(parsedJson);
}

// PUBLISH SCRIPT FILE
export async function publishScriptAction(input: Omit<PublishScriptInput, "userId">) {
    const userId = await getCurrentUserId();

    if (!userId) {
        throw new Error("UNAUTHORIZED");
    }

    const result = publishScript({
        ...input,
        userId,
    });

    revalidatePath("/resources/dynamo-scripts");
    revalidatePath("/dashboard");

    return result;
}

// PUBLISH SCRIPT VERSION
export async function publishVersionAction(slug: string, file: File, parsedJson?: any | null, changelog?: string) {
    const userId = await getCurrentUserId();

    if (!userId) {
        throw new Error("UNAUTHORIZED");
    }

    const result = await publishVersion(slug, userId, file, parsedJson, changelog);

    revalidatePath("/resources/dynamo-scripts");
    revalidatePath("/dashboard");

    return result;    
}

// DELETE ALL VERSIONS
export async function deleteAllVersionsAction(scriptId: string) {
    const userId = await getCurrentUserId();

    if (!userId) {
        throw new Error("UNAUTHORIZED");
    }

    await deleteAllVersions(scriptId);
}

// DELETE SCRIPT INCLUDING ALL VERSIONS
export async function deleteScriptAction(scriptId: string) {
    const userId = await getCurrentUserId();

    if (!userId) {
        throw new Error("UNAUTHORIZED");
    }

    await deleteScript(scriptId, userId);
    revalidatePath("/resources/dynamo-scripts");
    revalidatePath("/dashboard");

    return true;
}

// SUBSCRIBE NEWSLETTER
export async function subscribeAction(email: string) {
    return subscribeToKit(email);
}

// SUBMIT CONTACT MESSAGE
export async function submitContactAction(payload: ContactPayload) {
    const headerList = headers();
    const ip = (await headerList).get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const result = await submitContactMessage(payload, ip);

    if (!result.ok) {
        return {
            success: false,
            error: result.error,
            status: result.status,
        };
    }

    return {
        success: true,
        message: result.message,
    };
}
