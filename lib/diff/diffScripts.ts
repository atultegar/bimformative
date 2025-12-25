// compareDynamoScripts
import { Node, Connector } from "@/app/lib/interface";

export interface DiffResult {
    oldNodes: Node[];
    newNodes: Node[];
    removedNodeIds: Set<string>;
    addedNodeIds: Set<string>;
    changedNodeIds: Set<string>;
    changedNodes: { oldNode: Node; newNode: Node}[];
}

export function diffScripts(oldNodes: Node[], newNodes: Node[]): DiffResult {
    const oldMap = new Map(oldNodes.map((n) => [n.Id, n]));
    const newMap = new Map(newNodes.map((n) => [n.Id, n]));

    const oldIds = new Set(oldNodes.map((n) => n.Id));
    const newIds = new Set(newNodes.map((n) => n.Id))

    const removedNodeIds = new Set([...oldIds].filter((id) => !newIds.has(id)));
    const addedNodeIds = new Set([...newIds].filter((id) => !oldIds.has(id)));

    const changedNodeIds = new Set<string>();
    const changedNodes: { oldNode: Node; newNode: Node}[] = [];

    const nodeTypesWithInputValues = new Set([
        "CodeBlockNode",
        "StringInputNode",
        "NumberInputNode",
        "BooleanInputNode",
    ]);

    // Detect changed nodes
    for (const id of oldIds) {
        if (!newIds.has(id)) continue;

        const oldNode = oldMap.get(id)!;
        const newNode = newMap.get(id)!;

        //CASE 1: NodeType has InputValue → compare InputValue
        if (nodeTypesWithInputValues.has(oldNode.NodeType)) {
            if (oldNode.InputValue !== newNode.InputValue) {
                changedNodeIds.add(id);
                changedNodes.push({oldNode, newNode });
                continue;
            }
        }

        //CASE 2: PythonScriptNode → compare Code field
        if (oldNode.NodeType === "PythonScriptNode") {
            if (oldNode.Code !== newNode.Code) {
                changedNodeIds.add(id);
                changedNodes.push({ oldNode, newNode });
                continue;
            }
        }

    }

    return {
        oldNodes,
        newNodes,
        removedNodeIds,
        addedNodeIds,
        changedNodeIds,
        changedNodes,
    };
}