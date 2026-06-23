import { GHConnector, GHNode } from "@/app/lib/interface";
import * as d3 from "d3";
import { renderConnectors } from "./connectors/connectorRenderer";
import { nodeRenderers } from "./renderers/rendererRegistry";
import { renderGroups } from "./renderers/groupRenderer";
import { registerGradients } from "./styles/gradients";

type RenderGraphArgs = {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    nodes: GHNode[];
    connectors: GHConnector[];
    highlightAdded?: Set<string>;
    highlightRemoved?: Set<string>;
    highlightChanged?: Set<string>;
};

export function renderGrasshopperGraph({
    svg,
    nodes,
    connectors,
    highlightAdded,
    highlightRemoved,
    highlightChanged
}: RenderGraphArgs) {

    const defs = svg.append("defs");
    registerGradients(defs);
    
    // ROOT CONTAINER

    const container = svg.append("g").attr("class", "gh-graph-container");

    // LAYERS

    const groupLayer = container.append("g").attr("class", "gh-groups");

    const connectorLayer = container.append("g").attr("class", "gh-connectors");

    const nodeLayer = container.append("g").attr("class", "gh-nodes");

    // GROUP
    renderGroups({
        group: groupLayer,
        groups: nodes
    });

    // CONNECTORS

    renderConnectors({
        group: connectorLayer,
        connectors
    });

    // NODES
    nodes.forEach((node) => {

        const state = getNodeState(node.Id, highlightAdded, highlightRemoved, highlightChanged);

        const g = nodeLayer.append("g")
            .attr("class", `gh-node ${state}`)
            .attr("transform", `translate(${node.X}, ${node.Y})`);

        const renderer = nodeRenderers.find(r => r.canRender(node));

        if (!renderer)
            return;

        renderer.render(g, node, state);
        
    });

    return container;
}

function getNodeState(
    nodeId: string,
    highlightAdded?: Set<string>,
    highlightRemoved?: Set<string>,
    highlightChanged?: Set<string>
) {
    if (highlightAdded?.has(nodeId))
        return "added";

    if (highlightRemoved?.has(nodeId))
        return "removed";

    if (highlightChanged?.has(nodeId))
        return "changed";

    return "default";
}