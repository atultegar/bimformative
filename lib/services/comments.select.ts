export const SCRIPT_COMMENTS_FIELDS = `
    id,
    script_id,
    user_id,
    comment,
    created_at,
    profiles (
        first_name,
        last_name,
        avatar_url
    )
`;