// compareDynamoScripts
import { Node, Connector } from "@/app/lib/interface";

export interface DiffResult {
    oldNodes: Node[];
    newNodes: Node[];
    removedNodeIds: Set<string>;
    addedNodeIds: Set<string>;
}

export function diffScripts(oldNodes: Node[], newNodes: Node[]): DiffResult {
    const oldIds = new Set(oldNodes.map((n) => n.Id));
    const newIds = new Set(newNodes.map((n) => n.Id))

    const removedNodeIds = new Set([...oldIds].filter((id) => !newIds.has(id)));
    const addedNodeIds = new Set([...newIds].filter((id) => !oldIds.has(id)));

    return {
        oldNodes,
        newNodes,
        removedNodeIds,
        addedNodeIds,
    };
}