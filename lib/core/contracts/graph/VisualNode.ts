import { VisualPort } from "./VisualPort";

export interface VisualNode {
    id: string;
    name: string;
    nickName?: string| null;
    nodeType: string;
    renderKind?: GraphRenderKind;
    fullTypeName?: string | null;
    assemblyName?: string | null;
    category?: string | null;
    subCategory?: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
    inputs?: VisualPort[] | null;
    outputs?: VisualPort[] | null;
    value?: any;
    code?: string | null;
    isSpecialObject?: boolean;
    isCluster?: boolean;
}

export type GraphRenderKind = 
    | "component"
    | "param"
    | "slider"
    | "panel"
    | "relay"
    | "group"
    | "scribble"
    | "graphMapper"
    | "cluster"
    | "python"
    | "csharp"
    | "valueList"
    | "booleanToggle"
    | "colorSwatch";