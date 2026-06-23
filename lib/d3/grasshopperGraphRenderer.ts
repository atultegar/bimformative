import { GHConnector, GHNode } from "@/app/lib/interface";
import * as d3 from "d3";
import { createFixedLinearGradient } from "./d3Gradients";

type RenderGraphArgs = {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    nodes: GHNode[];
    connectors: GHConnector[];
    highlightAdded?: Set<string>;
    highlightRemoved?: Set<string>;
    highlightChanged?: Set<string>;
};

function getNodeState(
    nodeId: string,
    highlightAdded?: Set<string>,
    highlightRemoved?: Set<string>,
    highlightChanged?: Set<string>
) {
    if (highlightAdded?.has(nodeId)) return "added";
    if (highlightRemoved?.has(nodeId)) return "removed";
    if (highlightChanged?.has(nodeId)) return "changed";
    return "default";
}

function getStateColors(state: string) {
    switch (state) {
        case "added":
            return {
                border: "#22c55e",
                header: "rgba(34,197,94,0.5)",
                body: "rgba(34,197,94,0.5)",
                glow: "rgba(34,197,94,0.22)",
            };
        case "removed":
            return {
                border: "#ef4444",
                header: "rgba(239,68,68,0.22)",
                body: "rgba(239,68,68,0.22)",
                glow: "rgba(239,68,68,0.22)",
            };
        case "changed":
            return {
                border: "#3B83F6",
                header: "rgba(59,130,246,0.5)",
                body: "rgba(59,130,246,0.5)",
                glow: "rgba(59,130,246,0.22)",
            };

        default:
            return {
                border: "rgba(148,163,184,0.28)",
                header: "rgba(83,83,83,0.94)",
                body: "rgba(60,60,60,1)",
                glow: "rgba(34,211,238,0.08)",
            };        
    }
}


function curvePath(c: GHConnector) {
    const dx = Math.max(20, Math.abs(c.EndX - c.StartX) * 0.7);

    return `
        M ${c.StartX} ${c.StartY}
        C ${c.StartX + dx} ${c.StartY},
        ${c.EndX - dx} ${c.EndY},
        ${c.EndX} ${c.EndY}
    `;
}

export function renderGrasshopperGraph({
    svg,
    nodes,
    connectors,
    highlightAdded,
    highlightRemoved,
    highlightChanged,
}: RenderGraphArgs) {
    const defs = svg.append("defs");

    //Default node
    createFixedLinearGradient(defs, "node-default", [
        { offset: "25%", color: "#fff" },
        { offset: "75%", color: "#ddd" },
    ], 15);

    // Added (green)
    createFixedLinearGradient(defs, "node-added", [
        { offset: "0%", color: "#1e293b" },
        { offset: "100%", color: "#020617" },
    ], 15);

    // Removed (red) 
    createFixedLinearGradient(defs, "node-removed", [
        { offset: "0%", color: "#1e293b" },
        { offset: "100%", color: "#020617" },
    ], 15);

    // Changed (blue)
    createFixedLinearGradient(defs, "node-changed", [
        { offset: "0%", color: "#3b82f6" },
        { offset: "100%", color: "#1e3a8a" },
    ], 15);

    createFixedLinearGradient(defs, "node-name", [
        { offset: "0%", color: "#fff" },
        { offset: "100%", color: "#3c3c3c" },
    ], 15)

    createFixedLinearGradient(defs, "slider-name", [
        { offset: "0%", color: "#fff" },
        { offset: "100%", color: "#929292" },
    ], 10)


    const fillMap = {
        default: "url(#node-default)",
        added: "url(#node-added)",
        removed: "url(#node-removed)",
        changed: "url(#node-changed)",
    }

    const container = svg.append("g").attr("class", "gh-container");

    const connectorGroup = container.append("g");
    const nodeGroup = container.append("g");

    // CONNECTORS (GH style)
    connectors.forEach((c) => {
        const path = curvePath(c);
        const connectorColor = "rgba(87,86,82,1)";

        connectorGroup
            .append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", connectorColor)
            .attr("stroke-width", 3)
            .attr("stroke-linecap", "round");
    });

    // NODES (GH style)
    nodes.forEach((node) => {
        const state = getNodeState(
            node.Id,
            highlightAdded,
            highlightRemoved,
            highlightChanged
        );

        const colors = getStateColors(state);

        const g = nodeGroup
            .append("g")
            .attr("class", `node node-${state}`)
            .attr("transform", `translate(${node.X}, ${node.Y})`);

        // Component
        if (node.NodeType === "Component") {

            // Input circles
            node.Inputs?.forEach((input: any) => {

                g.append("circle")
                    .attr("cx", input.X - node.X - 2)
                    .attr("cy", input.Y - node.Y)
                    .attr("r", 4)
                    .attr("fill", "#fff")
                    .attr("stroke", "#3c3c3c")
                    .attr("stroke-width", 2);
            })

            // Output circles
            node.Outputs?.forEach((output: any) => {

                g.append("circle")
                    .attr("cx", output.X - node.X + 2)
                    .attr("cy", output.Y - node.Y)
                    .attr("r", 4)
                    .attr("fill", "#fff")
                    .attr("stroke", "#3c3c3c")
                    .attr("stroke-width", 2);
            })

            g.append("rect")
            .attr("width", node.Width)
            .attr("height", node.Height)
            .attr("rx", 3)
            .attr("fill", fillMap[state])
            .attr("stroke", "#232323");

            g.append("rect")
                .attr("x", node.Width/2 + 5)
                .attr("y", 1.5)
                .attr("width", 20)
                .attr("height", node.Height - 3)
                .attr("rx", 3)
                .attr("fill", "url(#node-name)")
                .attr("stroke", "#232323");

            const ng = g.append("g").attr("transform", `translate(${node.Width/2 + 15}, ${node.Height/2}) rotate(270 0 0)`);
            
            ng.append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", 13)
                .attr("font-weight", "semibold")
                .attr("fill", "#fff")
                .text(node.Name || "Component");

            node.Inputs?.forEach((input: any) => {
                const inputX = input.X - node.X;
                const inputY = input.Y - node.Y;

                const inputGroup = g.append("g").attr("class", "input-port");

                inputGroup
                    .append("text")
                    .attr("x", inputX + 5)
                    .attr("y", inputY )
                    .attr("dominant-baseline", "middle")
                    .attr("font-size", 10)
                    .text(input.Name);
            })

            node.Outputs?.forEach((output: any) => {
                const outputGroup = g.append("g").attr("class", "output-port");

                outputGroup
                    .append("text")
                    .attr("x", output.X - node.X - 5)
                    .attr("y", output.Y - node.Y )
                    .attr("dominant-baseline", "middle")
                    .attr("text-anchor", "end")
                    .attr("font-size", 10)
                    .text(output.Name);
            })

            
            
        }

        // Slider
        if (node.NodeType === "Slider") {
            g.append("circle")
                .attr("cx", node.Width)
                .attr("cy", node.Height/2)
                .attr("r", 4)
                .attr("fill", "#fff")
                .attr("stroke", "#3c3c3c")
                .attr("stroke-width", 2);

            g.append("rect")
            .attr("width", node.Width)
            .attr("height", node.Height)
            .attr("rx", 4)
            .attr("fill", fillMap[state])
            .attr("stroke", "#232323")
            .attr("stroke-width", 1);

            g.append("rect")
                .attr("width", node.Name.length * 7)
                .attr("height", node.Height)
                .attr("rx", 3)
                .attr("fill", "url(#slider-name)")
                .attr("stroke", "#232323");

            g.append("text")
                .attr("x", 5)
                .attr("y", node.Height/2)
                .attr("text-anchor", "start")
                .attr("dominant-baseline", "middle")
                .attr("font-size", 11)
                .attr("font-weight", "semibold")
                .attr("fill", "#3c3c3c")
                .text(node.Name || "Component");

            g.append("text")
                .attr("x", node.Width - 5)
                .attr("y", node.Height/2)
                .attr("text-anchor", "end")
                .attr("dominant-baseline", "middle")
                .attr("font-size", 11)
                .attr("font-weight", "semibold")
                .attr("fill", "#3c3c3c")
                .text(node.Value?.Current ?? "");
        }

        // Panel
        if (node.NodeType === "Panel") {
            g.append("circle")
                .attr("cx", 0)
                .attr("cy", node.Height/2)
                .attr("r", 4)
                .attr("fill", "#fff")
                .attr("stroke", "#3c3c3c")
                .attr("stroke-width", 2);

            g.append("circle")
                .attr("cx", node.Width)
                .attr("cy", node.Height/2)
                .attr("r", 4)
                .attr("fill", "#fff")
                .attr("stroke", "#3c3c3c")
                .attr("stroke-width", 2);

            g.append("rect")
                .attr("width", node.Width)
                .attr("height", node.Height)
                .attr("rx", 3)
                .attr("fill", "#fffa5a")
                .attr("stroke", "#232323");

            g.append("text")
                .attr("x", node.Width/2)
                .attr("y", node.Height/2)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", 11)
                .attr("font-weight", "semibold")
                .attr("fill", "#3c3c3c")
                .text(node.Value ?? "");
        }
        

        
    });

    nodeGroup.raise();

    return container;
}