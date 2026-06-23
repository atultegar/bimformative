import { VisualGraph } from "../../contracts/graph/VisualGraph";

export class GraphNormalizer {
    normalize(graph: any): VisualGraph {
        return {
            nodes:
                graph.nodes?.map((n: any) => ({
                    ...n,

                    Name:
                        n.Name?.trim() ?? "",

                    X:
                        Math.round(n.X ?? 0),

                    Y: 
                        Math.round(n.Y ?? 0),
                })) ?? [],

            connectors:
                graph.connectors ?? [],

            bounds:
                graph.bounds ?? null,
        }
    }
}