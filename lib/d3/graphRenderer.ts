import * as d3 from "d3";
import { Node, Connector } from "@/app/lib/interface";

type RenderGraphArgs = {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    nodes: Node[];
    connectors: Connector[];
    highlightAdded?: Set<string>;
    highlightRemoved?: Set<string>;
    highlightChanged?: Set<string>;
};

function truncateText(text: string, maxLength = 28) {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}` : text;
}

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

function curvePath(c: Connector) {
    const dx = Math.max(60, Math.abs(c.EndX - c.StartX) * 0.45);

    return `
        M ${c.StartX} ${c.StartY}
        C ${c.StartX + dx} ${c.StartY},
        ${c.EndX - dx} ${c.EndY},
        ${c.EndX} ${c.EndY}
    `;
}

function rounded_rect(x: number, y:number, w:number, h:number, r:number, tl:boolean, tr:boolean, bl:boolean, br:boolean) {
    let retval;
    retval  = "M" + (x + r) + "," + y;
    retval += "h" + (w - 2*r);
    if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
    else { retval += "h" + r; retval += "v" + r; }
    retval += "v" + (h - 2*r);
    if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
    else { retval += "v" + r; retval += "h" + -r; }
    retval += "h" + (2*r - w);
    if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
    else { retval += "h" + -r; retval += "v" + -r; }
    retval += "v" + (2*r - h);
    if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
    else { retval += "v" + -r; retval += "h" + r; }
    retval += "z";
    return retval;
}

export function renderGraph({
    svg,
    nodes,
    connectors,
    highlightAdded,
    highlightRemoved,
    highlightChanged,
}: RenderGraphArgs) {
    // svg.selectAll("*").remove();

    const defs = svg.append("defs");

    defs
        .append("filter")
        .attr("id", "node-soft-glow")
        .attr("x", "-30%")
        .attr("y", "-30%")
        .attr("width", "160%")
        .attr("height", "160%")
        .html(`
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
        `);

    const container = svg.append("g").attr("class", "graph-container");

    const connectorGroup = container.append("g").attr("class", "connectors");
    const nodeGroup = container.append("g").attr("class", "nodes");

    // CONNECTORS
    connectors.forEach((c) => {
        const path = curvePath(c);
        const connectorColor = "rgba(68,68,68,1)";

        connectorGroup
            .append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", connectorColor)
            .attr("stroke-width", 3)
            .attr("stroke-linecap", "round");

        connectorGroup
            .append("circle")
            .attr("cx", c.StartX)
            .attr("cy", c.StartY)
            .attr("r", 4)
            .attr("fill", connectorColor);

        connectorGroup.append("circle")
            .attr("cx", c.EndX)
            .attr("cy", c.EndY)
            .attr("r", 4)
            .attr("fill", connectorColor);
    });

    // NODES
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

        g.append("path")
            .attr("d", rounded_rect(0, 0, node.Width, node.Height, 10, true, true, false, false))
            .attr("fill", colors.body)
            .attr("stroke", colors.border)
            .attr("stroke-width", state === "default" ? 1.2 : 2);

        g.append("path")
            .attr("d", rounded_rect(0, 0, node.Width, 40, 10, true, true, false, false))
            .attr("fill", colors.header);

        g.append("text")
            .attr("x", 12)
            .attr("y", 22)
            .attr("font-size", 13)
            .attr("font-weight", 600)
            .attr("dominant-baseline", "middle")
            .attr("fill", "#e2e8f0")
            .text(truncateText(node.Name, 35));
            
        if (state != "default") {
            g.append("text")
            .attr("x", node.Width - 12)
            .attr("y", 22)
            .attr("font-size", 10)
            .attr("font-weight", 600)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("fill", colors.border)
            .text(state.toUpperCase());
        }

        node.Inputs?.forEach((input: any) => {
            const inputX = input.X - node.X;
            const inputY = input.Y - node.Y;

            const inputGroup = g.append("g").attr("class", "input-port");

            inputGroup
                .append("path")
                .attr("d", rounded_rect(inputX+0.5, inputY, input.Width, 25, 10, false, true, false, true))
                .attr("fill", colors.body)
                .attr("stroke", "gray")
                .attr("stroke-width", 1);

            inputGroup
                .append("rect")
                .attr("x", inputX)
                .attr("y", inputY+0.5)
                .attr("width", 4)
                .attr("height", 24)
                .attr("fill", "#38bdf8");

            inputGroup
                .append("text")
                .attr("x", inputX + 10)
                .attr("y", inputY + 12.5)
                .attr("font-size", 11)
                .attr("dominant-baseline", "middle")
                .attr("fill", "#cbd5e1")
                .attr("opacity", 0.92)
                .text(truncateText(input.Name, 22));

            inputGroup
                .append("text")
                .attr("x", inputX + input.Width - 8)
                .attr("y", inputY + 12.5)
                .attr("font-size", 11)
                .attr("dominant-baseline", "middle")
                .attr("text-anchor", "end")
                .attr("fill", "#cbd5e1")
                .text(">");
        });

        node.Outputs?.forEach((output: any) => {
            const outputX = output.X - output.Width - node.X;
            const outputY = output.Y - node.Y;

            const outputGroup = g.append("g").attr("class", "output-port");

            outputGroup
                .append("path")
                .attr("d", rounded_rect(outputX, outputY, output.Width-0.5, 25, 10, true, false, true, false))
                .attr("fill", colors.body)
                .attr("stroke", "gray")
                .attr("stroke-width", 1);
            

            outputGroup
                .append("text")
                .attr("x", outputX + 10)
                .attr("y", outputY + 12.5)
                .attr("font-size", 11)
                .attr("dominant-baseline", "middle")
                .attr("fill", "#cbd5e1")
                .attr("opacity", 0.92)
                .text(truncateText(output.Name, 22));
        });

        if (node.InputValueWidth > 0) {
            const valueX = 5;
            const valueY = 45;

            g.append("rect")
                .attr("x", valueX)
                .attr("y", valueY)
                .attr("width", node.Width - 30)
                .attr("height", 25)
                .attr("fill", "rgba(102,102,102,0.28)")
                .attr("stroke", "gray")
                .attr("stroke-width", 1);

            g.append("text")
                .attr("x", valueX + 5)
                .attr("y", valueY + 12.5)
                .attr("font-size", 11)
                .attr("dominant-baseline", "middle")
                .attr("fill", "#e2e8f0")
                .text(truncateText(String(node.InputValue ?? ""), 38))
        }
    });

    nodeGroup.raise();

    return container;
}