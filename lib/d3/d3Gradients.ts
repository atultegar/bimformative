import * as d3 from "d3";

export function createLinearGradient(
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
    id: string,
    stops: { offset: string; color: string; opacity?: number }[],
    direction: "vertical" | "horizontal" = "vertical"
) {
    const gradient = defs
        .append("linearGradient")
        .attr("id", id)
        .attr("x1", direction === "horizontal" ? "0%" : "0%")
        .attr("y1", direction === "horizontal" ? "0%" : "0%")
        .attr("x2", direction === "horizontal" ? "100%" : "0%")
        .attr("y2", direction === "horizontal" ? "0%" : "100%")

    stops.forEach((s) => {
        gradient.append("stop")
            .attr("offset", s.offset)
            .attr("stop-color", s.color)
            .attr("stop-opacity", s.opacity ?? 1);
    });
}

export function createFixedLinearGradient(
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
    id: string,
    stops: { offset: string; color: string; opacity?: number }[],
    length: number = 15,
    direction: "vertical" | "horizontal" = "vertical",    
) {
    const gradient = defs
        .append("linearGradient")
        .attr("id", id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", direction === "horizontal" ? 0 : 0)
        .attr("y1", direction === "horizontal" ? 0 : 0)
        .attr("x2", direction === "horizontal" ? length : 0)
        .attr("y2", direction === "horizontal" ? 0 : length)

    stops.forEach((s) => {
        gradient.append("stop")
            .attr("offset", s.offset)
            .attr("stop-color", s.color)
            .attr("stop-opacity", s.opacity ?? 1);
    });
}