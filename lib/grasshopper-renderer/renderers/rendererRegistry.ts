import { componentRenderer } from "./componentRenderer";
import { graphMapperRenderer } from "./graphMapperRenderer";
import { paramRenderer } from "./paramRenderer";
import { relayRenderer } from "./relayRenderer";

export const nodeRenderers = [
    graphMapperRenderer,
    relayRenderer,
    paramRenderer,
    
    componentRenderer,
];