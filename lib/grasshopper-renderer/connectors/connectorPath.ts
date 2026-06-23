import { GHConnector } from "@/app/lib/interface";

export function createConnectorPath(
    connector: GHConnector
): string {

    const dx = Math.max(20, Math.abs(connector.EndX - connector.StartX) * 0.7);

    return `
        M ${connector.StartX} ${connector.StartY}
        C ${connector.StartX + dx} ${connector.StartY},
        ${connector.EndX - dx} ${connector.EndY},
        ${connector.EndX} ${connector.EndY}
    `;
}