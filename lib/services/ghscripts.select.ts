// Minimal fields - safe for public listing
export const GHSCRIPT_MINIMAL_FIELDS = `
    id,
    owner_id,
    title,
    slug,
    description,
    script_type,
    visibility,
    organization_id,
    tags,
    thumbnail_url,
    created_at,
    updated_at,
    current_version_number,
    owner_first_name,
    owner_last_name,
    owner_avatar_url,
    demo_link,
    downloads_count,
    likes_count
`;

// Full script detail - for detail page
export const GHSCRIPT_DETAIL_FIELDS = `*`;

export const GHSCRIPT_DETAIL_MINIMUM = `
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
    likes_count,
    updated_at,
    tags,
    dynamo_version,
    is_player_ready,
    external_packages,
    is_public    
`

export const GHSCRIPT_OWNER_FIELDS = `
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
    tags,
    updated_at
`;

export const GHSCRIPT_SLUG_ONLY = `
    id,
    slug,
    updated_at
`;

export const GHSCRIPT_DOWNLOAD_FIELDS = `
    id,
    title,
    slug,
    version_id,
    original_file_url,
    current_version_number
`;

export const GH_PYTHON_SCRIPTS_FIELDS = `
    id,
    script_version_id,
    node_id,
    order_index,
    python_code,
    created_at
`;

export const GHSCRIPT_UPDATE_FIELDS = `
    id,
    title,
    description,
    script_type,
    tags,
    current_version_number
`;