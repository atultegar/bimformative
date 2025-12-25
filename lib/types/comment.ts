export type Comment = {
    id: string;
    script_id: string;
    user_id: string;
    comment: string;
    created_at: string;
    profiles: {
        first_name: string;
        last_name: string;
        avatar_url: string;
    }
}