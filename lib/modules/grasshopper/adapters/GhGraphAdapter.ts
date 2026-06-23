import { VisualGraph } from "@/lib/core/contracts/graph/VisualGraph";

export class GhGraphAdapter {
    adapt(parsedGraph: any): VisualGraph {
        return {
            nodes: parsedGraph.Nodes ?? [],
            connectors: parsedGraph.Connectors ?? [],
            bounds: parsedGraph.Bounds ?? null,
        };
    }
}