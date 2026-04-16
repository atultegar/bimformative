export interface SemanticInputOutput {
    id: string;
    name: string;
}

export interface SemanticNode {
    id: string;
    nodeType: string;
    code?: string | null;
    inputValue?: string | null;
    inputs: SemanticInputOutput[];
    outputs: SemanticInputOutput[];
}

export interface SemanticConnector {
    startId: string;
    endId: string;
}

export interface SemanticScript {
    name: string;
    description: string;
    dynamoVersion: string;
    nodes: SemanticNode[];
    connectors: SemanticConnector[];
}