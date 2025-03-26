export interface ProjectsCard {
    title: string;
    _id: string;
    imageUrl: string,
    tags: string[];
    description: string;
    link: string;
}

export interface simpleBlogCard {
    title: string;
    smallDescription: string;
    currentSlug: string;
    titleImage: any;
    date: string;
    author: Author;
    tags: string[];
}

export interface fullBlog {
    currentSlug: string;
    title: string;
    content: any;
    titleImage: any;
    date: string;
    tags: string[];
    smallDescription: string;
}

export interface Author {
    name: string;
    pictureurl: string;
}

export interface dynamoscript {
    _id: string;
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
