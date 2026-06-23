import { GHNode } from "@/app/lib/interface";
import * as d3 from "d3";

export const componentRenderer = {
    canRender(node: GHNode) {
        return (
            node.RenderKind === "component" ||
            node.NodeType.includes("Component")
        );
    },

    render(
        g: d3.Selection<SVGGElement, unknown, null, undefined>,
        node: GHNode,
        state: string
    ) {
        // INPUT AND OUTPUT CIRCLES
        node.Inputs?.forEach((input) => {
            g.append("circle")
                .attr("cx", input.X - node.X - 2)
                .attr("cy", input.Y - node.Y)
                .attr("r", 4)
                .attr("fill", "#ffffff")
                .attr("stroke", "#3c3c3c")
                .attr("stroke-width", 2);
        });

        node.Outputs?.forEach((output) => {
            g.append("circle")
                .attr("cx", output.X - node.X + 2)
                .attr("cy", output.Y - node.Y)
                .attr("r", 4)
                .attr("fill", "#ffffff")
                .attr("stroke", "#3c3c3c")
                .attr("stroke-width", 2);
        });
        
        // MAIN BODY
        g.append("rect")
            .attr("width", node.Width)
            .attr("height", node.Height)
            .attr("rx", 3)
            .attr("fill", `url(#gh-component-${state})`)
            .attr("stroke", "#232323")
            .attr("stroke-width", 1);

        // TITLE STRIP
        g.append("rect")
            .attr("x", node.Width/2 - 10)
            .attr("y", 1)
            .attr("width", 20)
            .attr("height", node.Height - 2)
            .attr("rx", 3)
            .attr("fill", `url(#gh-header-${state})`)
            .attr("stroke", "#232323")
            .attr("stroke-width", 1);

        // NODE TITLE
        const titleGroup = g.append("g")
            .attr(
                "transform",
                `translate(${node.Width/2}, ${node.Height / 2})
                rotate(270)`
            );

        titleGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", 11)
            .attr("font-family", "Segoe UI")
            .attr("fill", "#ffffff")
            .text(node.NickName ?? node.Name);

        // INPUTS
        node.Inputs?.forEach((input) => {
            const localX = input.X - node.X;
            const localY = input.Y - node.Y;

            g.append("text")
                .attr("x", localX + 6)
                .attr("y", localY)
                .attr("dominant-baseline", "middle")
                .attr("font-size", 10)
                .attr("font-family", "Segoe UI")
                .attr("fill", "#232323")
                .text(input.NickName ?? input.Name);
        });

        // OUTPUTS
        node.Outputs?.forEach((output) => {
            const localX = output.X - node.X;
            const localY = output.Y - node.Y;

            g.append("text")
                .attr("x", localX - 6)
                .attr("y", localY)
                .attr("text-anchor", "end")
                .attr("dominant-baseline", "middle")
                .attr("font-size", 10)
                .attr("font-family", "Segoe UI")
                .attr("fill", "#232323")
                .text(output.NickName ?? output.Name);
        });

    }
}