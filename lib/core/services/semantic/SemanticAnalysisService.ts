export class SemanticAnalysisService {
    analyze(graph: any) {
        const nodes = graph.nodes ?? [];

        const complexity = 
            nodes.length < 25
            ? "simple"
            : nodes.length < 100
            ? "medium"
            : "complex";

        return {
            complexity,

            nodeCount: nodes.length,

            categories: [
                ...new Set(
                    nodes
                        .map((n: any) => n.Category)
                        .filter(Boolean)
                ),
            ],

            nodeTypes: [
                ...new Set(
                    nodes
                        .map((n: any) => n.NodeType)
                        .filter(Boolean)
                ),
            ],
        };
    }
}