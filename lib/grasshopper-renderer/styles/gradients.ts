import * as d3 from "d3";
import { getNodeTheme, NodeState } from "./nodeTheme";

export function registerGradients(
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>
) {
    const states: NodeState[] = [
        "default",
        "added",
        "removed",
        "changed",
        "selected"
    ];

    states.forEach((state) => {

        const theme = getNodeTheme(state);

        // COMPONENT BODY
        createLinearGradient(defs, `gh-component-${state}`, theme.bodyTop, theme.bodyBottom);

        // COMPONENT HEADER
        createLinearGradient(defs, `gh-header-${state}`, theme.headerTop, theme.headerBottom, 13);
    });

    // STATIC TYPES - #TODO
    
}

function createLinearGradient(defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, id: string, topColor: string, bottomColor: string, length: number = 15) {
    const gradient = 
        defs.append("linearGradient")
            .attr("id", id)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", length);

    gradient
        .append("stop")
        .attr("offset", "25%")
        .attr("stop-color", topColor);

    gradient
        .append("stop")
        .attr("offset", "75%")
        .attr("stop-color", bottomColor);        
}