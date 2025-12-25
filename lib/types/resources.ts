export type ResourceCounts = {
    blogCount: number;
    docCount: number;
    dynamoScriptCount: number;
    codeSnippetCount: number;
    tutorialCount: number;
    otherAssetCount: number;
}

export type RoadmapItem = {
    id: string;
    title: string;
    description: string;
    image: string;
    type: string;
    status: number;
}