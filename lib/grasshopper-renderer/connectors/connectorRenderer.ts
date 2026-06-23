import { GHConnector } from "@/app/lib/interface";
import * as d3 from "d3";
import { createConnectorPath } from "./connectorPath";

type RenderConnectorsArgs = {
    group: d3.Selection<SVGGElement, unknown, null, undefined>;
    connectors: GHConnector[];
};

export function renderConnectors({
    group,
    connectors
}: RenderConnectorsArgs) {
    
    connectors.forEach((connector) => {

        const path = createConnectorPath(connector);

        // MAIN WIRE
        group
            .append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", getConnectorColor(connector))
            .attr("stroke-width", getConnectorThickness(connector))
            .attr("opacity", 0.95)
            .attr("stroke-linecap", "round");

        // RELAY WIRES

        if (connector.IsRelayConnection) {
            group
                .append("path")
                .attr("d", path)
                .attr("fill", "none")
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("opacity", 0.35)
                .attr("stroke-dasharray", "4,4");
        }
    });
}

function getConnectorColor(
    connector: GHConnector
) {
    switch (connector.WireType) {
        case "hidden":
            return "rgba(120,120,120,0.2)";

        case "faint":
            return "rgba(120,120,120,0.45)";

        default:
            return "#6f6f6f";
    }
}

function getConnectorThickness(
    connector: GHConnector
) {
    if (connector.IsRelayConnection)
        return 2.2;

    return 2.8;
}