import { SemanticNode, SemanticScript } from "./semanticTypes";

export function analyzeScript(json: string): SemanticScript {
    const script = JSON.parse(json);

    const result : SemanticScript = {
        name: script?.Name ?? "",
        description: script?.Description ?? "",
        dynamoVersion: script?.View?.Dynamo?.Version ?? "",
        nodes: [],
        connectors: []
    }

    const nodes = script?.Nodes ?? []
    const connectors = script?.Connectors ?? []

    for (const node of nodes) {
        const semanticNode: SemanticNode = {
            id: node?.Id ?? "",
            nodeType: node?.NodeType ?? "",
            code: node?.Code ?? null,
            inputValue: node?.InputValue ?? null,
            inputs: [],
            outputs: []
        }

        const inputs = node?.Inputs ?? [];
        for (const input of inputs) {
            semanticNode.inputs.push({
                id: input?.Id ?? "",
                name: input?.Name ?? ""
            });
        }

        const outputs = node?.Outputs ?? [];
        for (const output of outputs) {
            semanticNode.inputs.push({
                id: output?.Id ?? "",
                name: output?.Name ?? ""
            });
        }

        result.nodes.push(semanticNode);
    }

    for (const connector of connectors) {
        result.connectors.push({
            startId: connector?.Start ?? "",
            endId: connector?.End ?? ""
        });
    }

    return result;
}