// Minimal fields - safe for public listing
export const SCRIPT_MINIMAL_FIELDS = `
    id,
    owner_id,
    title,
    slug,
    description,
    script_type,
    current_version_number,
    owner_first_name,
    owner_last_name,
    owner_avatar_url,
    demo_link,
    downloads_count,
    likes_count
`;

// Full script detail - for detail page
export const SCRIPT_DETAIL_FIELDS = `*`;

export const SCRIPT_OWNER_FIELDS = `
    id,
    owner_id,
    title,
    slug,
    description,
    script_type,
    current_version_number,
    demo_link,
    downloads_count,
    likes_count,
    is_public,
    tags
`;

export const SCRIPT_SLUG_ONLY = `
    id,
    slug
`;

export const SCRIPT_DOWNLOAD_FIELDS = `
    id,
    title,
    slug,
    version_id,
    dyn_file_url,
    current_version_number
`;

export const PYTHON_SCRIPTS_FIELDS = `
    id,
    script_version_id,
    node_id,
    order_index,
    python_code,
    created_at
`;

export const SCRIPT_UPDATE_FIELDS = `
    id,
    title,
    description,
    script_type,
    tags,
    current_version_number
`;