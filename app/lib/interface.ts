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
}

export interface Author {
    name: string;
    picture: any;
}

export interface dynamoscript {
    scriptfile: File;
    title: string;
    description: string;
    tags: string[];
    fileUrl: string;
    youtubelink: string;
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

// name,
//         slug,
//         _id,
//         "postCount": count(*[_type == "blog" && references("tags", ^._id)])