export const SCRIPT_VISIBILITY = {
    PUBLIC: "public",
    PRIVATE: "private",
    ORGANIZATION: "organization",
} as const;

export type ScriptVisibility =
    typeof SCRIPT_VISIBILITY[keyof typeof SCRIPT_VISIBILITY];