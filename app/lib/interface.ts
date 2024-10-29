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
}

export interface fullBlog {
    currentSlug: string;
    title: string;
    content: any;
    titleImage: any;
}

export interface Author {
    name: string;
    picture: any;
}