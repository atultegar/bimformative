import { APIKeys } from "@clerk/nextjs";
import { DbUser } from "./interface";
import { client } from "./sanity";
import { getAllDynamoScriptsPropsQuery } from "./sanityQueries";

const DEV_KEY = process.env.DEV_MODE_MASTER_KEY as string;

export interface DynamoScriptsResponse {
  data: any[];
  page: number;
  limit: number;
  total: number;
  totalPages: number
}

export async function getAllDynamoScripts({
  page = 1,
  limit = 10,
  search = "",
  type = "",
  ownerId = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  ownerId?: string;
} = {}): Promise<DynamoScriptsResponse> {
      
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search) params.set("search", search);
  if (type) params.set("type", type);
  if (ownerId) params.set("ownerId", ownerId);

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/scripts?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "x-dev-key": DEV_KEY},
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return {
      data: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
    };
  }

  const json = await res.json();

  return {
    data: json.scripts ?? [],
    page: json.page ?? page,
    limit: json.limit ?? limit,
    total: json.total ?? 0,
    totalPages: json.totalPages ?? 0,
  };    
}

export async function getDynScriptProps(){
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/scripts`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const { data } = await res.json();

  return data?.map((s: any) => ({
    id: s.id,
    slug: s.slug,
  })) ?? [];
}

export async function getDynScriptsByUser(userId: string){
  const query = `*[_type == "dynamoscript" && author->id == "${userId}"] | order(_createdAt desc) {
        _id,
        title,
        scriptfile,
        description,
        tags,
        "fileUrl": scriptfile.asset->url,
        youtubelink,
        "scripttype": scripttype->name,
        dynamoplayer,
        externalpackages,
        pythonscripts,
        "image": image.asset->url,
        "code": scriptView.code,
        "author": coalesce(author->givenName) + " " +coalesce(author->familyName),
        "authorPicture": author->pictureurl,
        downloads,
        likes,
        dynamoversion,
        "comments": comments[]-> {
          "userid": user->id,
          "username": coalesce(user->givenName) + " " +coalesce(user->familyName),
          "userpicture": user->pictureurl,
          text,
          timestamp,          
          "id": _id,
          },
       }`;
  
  return client.fetch(query);
}

export async function getDynScriptById(id: string){
  const query = `*[_type == "dynamoscript" && _id == "${id}"][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        scriptfile,
        description,
        tags,
        "fileUrl": scriptfile.asset->url,
        youtubelink,
        "scripttype": scripttype->name,
        dynamoplayer,
        externalpackages,
        pythonscripts,
        "image": image.asset->url,
        "code": scriptView.code,
        "author": coalesce(author->givenName) + " " +coalesce(author->familyName),
        "authorPicture": author->pictureurl,
        downloads,
        likes,
        dynamoversion,
        "comments": comments[]-> {
          "userid": user->id,
          "username": coalesce(user->givenName) + " " +coalesce(user->familyName),
          "userpicture": user->pictureurl,
          text,
          timestamp,          
          "id": _id,
          },
       }`;
  
  return client.fetch(query);
}

export async function getUser(userid?: string): Promise<DbUser | null> {
    if(!userid) return null;
    const query = `*[_type == "author" && _id == "${userid}"][0] {
    _id,
    givenName,
    familyName,
    email,
    pictureurl,
    }`;

    return await client.fetch(query);
}

export async function getBlogData(slug: string){
  const query = `
      *[_type == "blog" && slug.current=='${slug}'] {
      "currentSlug": slug.current,
          title,
          content,
          titleImage,
          date,
          "tags": coalesce(tags, ["untagged"]),
          smallDescription,
      }[0]`;

  return await client.fetch(query);
}