import { ScriptMinimal } from "@/lib/types/script";
import { Any } from "next-sanity";

export interface ProjectsCard {
    title: string;
    _id: string;
    imageUrl: string,
    tags: string[];
    description: string;
    link: string;
}

export interface SimpleBlogCard {
    title: string;
    smallDescription: string;
    slug: string;
    titleImage: any;
    date: string;
    author: Author;
    tags: string[];
    featured: boolean;
}

export interface FullBlog {    
    title: string;
    smallDescription: string;    
    slug: string;    
    titleImage: any;
    date: string;    
    author: Author;
    tags: string[];
    content: any;    
}

export interface Author {
    name: string;
    pictureurl: string;
}

export interface dynamoscript {
    _id: string;
    _createdAt: string;
    _updatedAt: string;
    scriptfile: File;
    title: string;
    description: string;
    tags: string[];
    fileUrl: string;
    youtubelink: string;
    scripttype: string;
    dynamoplayer: boolean;
    externalpackages: string[];
    pythonscripts: boolean;
    image: string;
    code: string;
    author: string;
    authorPicture: string;
    downloads: number;
    likes: string[];
    dynamoversion: string;
    comments: comment[];
}

export interface comment {
    userid: string;
    username: string;
    userpicture: string;    
    text: string;
    timestamp: string;
    id: string;
}

export interface otherassets {
    file: File;
    title: string;
    description: string;
    image: any;
    assettype: string;
    youtubelink: string;
    tags: string[];
    fileUrl: string;
}

export interface codeSnippet {
    title: string;
    codeField: codeField;
}

export interface codeField {
    language: string;
    code: string;
}

export interface tag {
    name: string;
    slug: string;
    postCount: number;
}

export interface videoTutorial {
    name: string;
    description: string;
    youtube: string;
}

export interface DocsCard {
    name: string;
    imageUrl: string,
    tags: string[];
    description: string;
    url: string;
}

export interface Node {
    Id: string;
    Name: string;
    X: number;
    Y: number;
    Width: number;
    Height: number;
    Inputs: Array<InputOutput>;
    Outputs: Array<InputOutput>;
    NodeType: string;
    Code: string;
    InputValue: string;
    InputValueWidth: number;
}

export interface InputOutput {
    Id: string;
    Name: string;
    Type: string;
    X: number;
    Y: number;
    Width: number;
}

export interface Connector {
    Id: string;
    StartId: string;
    EndId: string;
    StartX: number;
    StartY: number;
    EndX: number;
    EndY: number;
}

export interface User {
    Id: string;
    Email: string;
    LastName: string;
    FirstName: string;
    Picture: string;
}

export interface DbUser{
    id: string;
    givenName: string;
    familyName: string;
    email: string;
    pictureurl: string;
}

export interface PythonNode {
    nodeId: string;
    code: string;
}

export interface UploadScript {
    userId: string;
    title: string;
    slug: string;
    description?: string | null;
    script_type?: string;
    tags?: string[] | string;
    changelog?: string;
    dynFile: File | Blob | Buffer;
    jsonContent?: any;
    scriptView?: string;
    dynamoVersion?: string;
    isPlayerReady?: boolean;
    externalPackages?: string[];
    pythonNodes?: PythonNode[];
}

export interface ScriptVersion {
    id: string;
    version_number: number;
    title: string;
    updated_at: string;
    dyn_file_url: string;
    changelog: string;
    is_current: boolean;
}

export interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface ScriptSlug {
    id: string;
    slug: string;
    updated_at: string;
};

export interface PaginatedResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PublicScript {
    id: string;
    owner_id: string;
    title: string;
    slug: string;
    description: string;
    script_type: string;
    current_version_number: number;
    owner_first_name: string;
    owner_last_name: string;
    owner_avatar_url: string;
    demo_link: string;
    downloads_count: number;
    likes_count: number;
}

export interface SanitySearchParams {
    search: string;
    page?: number;
    limit?: number;
}

export interface SanitySearchResult<T = any> {
    results: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}