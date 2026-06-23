import { SemanticCategory } from "./SemanticCategory";
import { SemanticFeatures } from "./SemanticFeatures";
import { SemanticMetrics } from "./SemanticMetrics";
import { SemanticNodeType } from "./SemanticNodeType";

export interface SemanticGraph {
    platform: "dynamo" | "grasshopper";
    complexity: "simple" | "medium" | "complex";
    metrics: SemanticMetrics;
    features: SemanticFeatures;
    nodeTypes: SemanticNodeType[];
    categories: SemanticCategory[];
    tags?: string[];
    dependencies?: string[];
    warnings?: string[]; 
}