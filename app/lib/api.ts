import { DbUser } from "./interface";
import { client } from "./sanity";
import { getAllDynamoScriptsPropsQuery } from "./sanityQueries";



export async function getAllDynamoScripts() {
    const query = `
      *[_type == 'dynamoscript'] | order(_createdAt desc) {
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
    
      const data = await client.fetch(query);
    
      return data;
}

export async function getDynScriptProps(){
  return await client.fetch(getAllDynamoScriptsPropsQuery);
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