import { fullBlog, simpleBlogCard } from "./interface";
import { client } from "./sanity";

export async function getAllBlogs() {
    const query = `
  *[_type == 'blog'] | order(_createdAt desc) {
  title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    date,
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
    "tags": coalesce(tags, ["Untagged"]),
  }`;

  const data = await client.fetch(query);

  return data;
}