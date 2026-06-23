export interface VisualPort {
    id: string;
    name: string;
    nickName?: string | null;
    direction: "input" | "output";
    parentNodeId: string;
    x: number;
    y: number;
    dataType?: string | null;
    accessType?: "item" | "list" | "tree" | null;
    isConnected?: boolean;
}