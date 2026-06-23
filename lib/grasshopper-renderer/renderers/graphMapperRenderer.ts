import { GHNode } from "@/app/lib/interface";
import * as d3 from "d3";

export const graphMapperRenderer = {
    canRender(node: GHNode) {
        return (
            node.RenderKind === "graphMapper" ||
            node.FullTypeName?.includes("Grasshopper.Kernel.Special.GH_GraphMapper")
        );
    },

    render(
        g: d3.Selection<SVGGElement, unknown, null, undefined>,
        node: GHNode,
        state: string
    ) {        
        // LEFT PORT
        g.append("circle")
            .attr("cx", 0)
            .attr("cy", node.Height / 2)
            .attr("r", 4)
            .attr("fill", "#ffffff")
            .attr("stroke", "#3c3c3c")
            .attr("stroke-width", 2);

        // RIGHT PORT
        g.append("circle")
            .attr("cx", node.Width)
            .attr("cy", node.Height / 2)
            .attr("r", 4)
            .attr("fill", "#ffffff")
            .attr("stroke", "#3c3c3c")
            .attr("stroke-width", 2);
        
        // MAIN BODY
        g.append("rect")
            .attr("width", node.Width)
            .attr("height", node.Height)
            .attr("rx", 3)
            .attr("fill", "#4a4a4a")
            .attr("stroke", "#232323")
            .attr("stroke-width", 1);        
    }
}