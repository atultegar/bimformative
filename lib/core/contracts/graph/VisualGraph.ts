import { GraphBounds } from "./GraphBounds";
import { VisualConnector } from "./VisualConnector";
import { VisualNode } from "./VisualNode";

export interface VisualGraph {    
    nodes: VisualNode[];
    connectors: VisualConnector[];
    bounds?: GraphBounds| null;
}

export interface GraphMetadata {
    platform: "dynamo" | "grasshopper";
    version?: string | null;
    author?: string | null;
    units?: string | null;
}