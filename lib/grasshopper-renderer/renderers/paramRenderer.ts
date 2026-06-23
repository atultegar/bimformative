import { GHNode } from "@/app/lib/interface";
import * as d3 from "d3";

export const paramRenderer = {
    canRender(node: GHNode) {
        return (
            node.RenderKind === "param" ||
            node.FullTypeName?.includes("Grasshopper.Kernel.Parameters")
        );
    },

    render(
        g: d3.Selection<SVGGElement, unknown, null, undefined>,
        node: GHNode,
        state: string
    ) {
        const width = node.Width || 120;
        const height = node.Height || 24;

        // INPUT AND OUTPUT CIRCLES
        // LEFT PORT
        g.append("circle")
            .attr("cx", 0)
            .attr("cy", height / 2)
            .attr("r", 4)
            .attr("fill", "#ffffff")
            .attr("stroke", "#3c3c3c")
            .attr("stroke-width", 2);

        // RIGHT PORT
        g.append("circle")
            .attr("cx", width)
            .attr("cy", height / 2)
            .attr("r", 4)
            .attr("fill", "#ffffff")
            .attr("stroke", "#3c3c3c")
            .attr("stroke-width", 2);

        node.Inputs?.forEach((input) => {
            
        });

        node.Outputs?.forEach((output) => {
            // g.append("circle")
            //     .attr("cx", output.X - node.X + 2)
            //     .attr("cy", output.Y - node.Y)
            //     .attr("r", 4)
            //     .attr("fill", "#ffffff")
            //     .attr("stroke", "#3c3c3c")
            //     .attr("stroke-width", 2);
        });
        
        // MAIN BODY
        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 3)
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

        // OPTIONAL VALUE
        // if (node.Value) {
        //     const valueText = 
        //         Array.isArray(node.Value)
        //         ? node.Value.join(", ")
        //         : String(node.Value);

        //     g.append("text")
        //         .attr("x", width / 2)
        //         .attr("y", height + 14)
        //         .attr("text-anchor", "middle")
        //         .attr("font-size", 9)
        //         .attr("font-family", "Segoe UI")
        //         .attr("fill", "#cfcfcf")
        //         .text(valueText.substring(0, 40));
        // }

    }
}