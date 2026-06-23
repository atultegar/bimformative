import { GHNode } from "@/app/lib/interface";
import * as d3 from "d3";

type RendeerGroupsArgs = {
    group: d3.Selection<SVGGElement, unknown, null, undefined>;
    groups: GHNode[];
}

export function renderGroups({
    group,
    groups
}: RendeerGroupsArgs) {
    groups.forEach((g) => {
        if (g.RenderKind == "group" || g.FullTypeName?.includes("Grasshopper.Kernel.Special.GH_Group")){
             group.append("rect")
                .attr("x", g.X)
                .attr("y", g.Y)
                .attr("width", g.Width)
                .attr("height", g.Height)
                .attr("fill", g.Value?.Colour)
                .attr("stroke", "#2f2f2f80")
                .attr("stroke-width", 1);

            group.append("text")
                .attr("x", g.X + g.Width / 2)
                .attr("y", g.Y - 5)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "bottom")
                .attr("font-size", 10)
                .attr("font-family", "Segoe UI")
                .text(g.NickName ?? g.Name);
        }
    })
}