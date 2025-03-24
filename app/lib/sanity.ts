import {createClient} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const BEARER_TOKEN = process.env.SANITY_BEARER_TOKEN;

export const client = createClient({
    projectId: "wlb0lt21",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: BEARER_TOKEN
});
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source);
}