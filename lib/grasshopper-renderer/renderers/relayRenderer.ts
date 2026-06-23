import { GHNode } from "@/app/lib/interface";
import * as d3 from "d3";

export const relayRenderer = {
    canRender(node: GHNode) {
        return (
            node.RenderKind === "relay" ||
            node.FullTypeName?.includes("Grasshopper.Kernel.Special.GH_Relay")
        );
    },

    render(
        g: d3.Selection<SVGGElement, unknown, null, undefined>,
        node: GHNode,
        state: string
    ) {
        const width = node.Width || 56;
        const height = node.Height || 16;
        
        // MAIN BODY
        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("rx", height/2)
            .attr("fill", "##2f2f2f")
            .attr("stroke", "#2f2f2f")
            .attr("stroke-width", 1);

        g.append("rect")
            .attr("x", height/2)
            .attr("width", width-height)
            .attr("height", height)
            .attr("fill", "#5f5f5f")
            .attr("stroke", "#2f2f2f")
            .attr("stroke-width", 1);
        
        // PARAM NAME
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", 10)
            .attr("font-family", "Segoe UI")
            .attr("fill", "#ffffff")
            .text(node.NickName ?? node.Name);
    }
}