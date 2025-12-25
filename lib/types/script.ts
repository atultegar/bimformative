export type PublicScriptFilters = {
    search?: string;
    type?: string;
};

export type PaginationParams = {
    page?: number;
    limit?: number;
}

export type ScriptMinimal = {
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
    liked_by_user: boolean;
}

export type ScriptDownloadResult = {
    stream: ReadableStream;
    filename: string;
}

export type ScriptDashboard = {
    id: string;
    owner_id: string;
    title: string;
    slug: string;
    description: string;
    script_type: string;
    tags: string[];
    current_version_number: number;
    dynamo_version: string;    
    owner_first_name: string;
    owner_last_name: string;
    owner_avatar_url: string;
    demo_link: string;
    downloads_count: number;
    likes_count: number;
    liked_by_user: boolean;
    dyn_file_url: string;
    is_public: boolean;
    updated_at: string;
}

export type PythonScript = {
    id: string;
    script_version_id: string;
    node_id: string;
    order_index: number;
    python_code: string;
}

export type ScriptUpdate = {
    title: string;
    description: string;
    script_type: string;
    tags: string[];
    current_version: string;
}

export type ScriptPublish = {
    title: string;
    description: string;
    script_type: string;
    tags: string[];
    demo_link: string;
    is_public: boolean;
}
    