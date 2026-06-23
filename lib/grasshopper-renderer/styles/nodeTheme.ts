export type NodeState =
    | "default"
    | "added"
    | "removed"
    | "changed"
    | "selected"

export interface NodeTheme {
    bodyTop: string;
    bodyBottom: string;
    headerTop: string;
    headerBottom: string;
    border: string;
    text: string;
    secondaryText: string;
    portFill: string;
    portStroke: string;
    connector: string;
    glow?: string;
}

const baseTheme: NodeTheme = {
    bodyTop: "#ffffff",
    bodyBottom: "#dddddd",
    headerTop: "#ffffff",
    headerBottom: "#3c3c3c",
    border: "#232323",
    text: "#ffffff",
    secondaryText: "#d4d4d4",
    portFill: "#ffffff",
    portStroke: "#3c3c3c",
    connector: "#6f6f6f",
    glow: "rgba(255,255,255,0.08)"
};

export const nodeThemes: Record<NodeState, NodeTheme> = {
    default: {
        ...baseTheme
    },

    added: {
        ...baseTheme,
        bodyTop: "#27563a",
        bodyBottom: "#183524",
        headerTop: "#2f7047",
        headerBottom: "#214d32",
        border: "#22c55e",
        connector: "#22c55e",
        glow: "rgba(34,197,94,0.25)"
    },

    removed: {
        ...baseTheme,
        bodyTop: "#5a2d2d",        
        bodyBottom: "#341919",
        headerTop: "#8b3a3a",
        headerBottom: "#5a2525",
        border: "#ef4444",
        connector: "#ef4444",
        glow: "rgba(239,68,68,0.22)"
    },

    changed: {
        ...baseTheme,
        bodyTop: "#35507c",
        bodyBottom: "#22324d",
        headerTop: "#4871aa",
        headerBottom: "#2f4e78",
        border: "#3b82f6",
        connector: "#3b82f6",
        glow: "rgba(59,130,246,0.22)"
    },

    selected: {
        ...baseTheme,
        bodyTop: "#666666",
        bodyBottom: "#4d4d4d",
        headerTop: "#8a8a8a",
        headerBottom: "#696969",
        border: "#facc15",
        connector: "#facc15",
        glow: "rgba(250,204,21,0.24)"
    }
};

export function getNodeTheme(state: NodeState): NodeTheme {
    return nodeThemes[state] ?? nodeThemes.default;
}
