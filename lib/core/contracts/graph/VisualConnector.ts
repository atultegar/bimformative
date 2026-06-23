export interface VisualConnector {
    id: string;
    startNodeId: string;
    startPortId: string;
    endNodeId: string;
    endPortId: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isRelayConnection?: boolean;
}