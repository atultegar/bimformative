import { DbUser } from "./interface";
import { client } from "./sanity";



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
          "userid": user->_id,
          "username": coalesce(user->givenName) + " " +coalesce(user->familyName),
          "userpicture": user->pictureurl,
          text,
          timestamp,
          },
      }`;
    
      const data = await client.fetch(query);
    
      return data;
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
          "userid": user->_id,
          "username": coalesce(user->givenName) + " " +coalesce(user->familyName),
          "userpicture": user->pictureurl,
          text,
          timestamp,
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