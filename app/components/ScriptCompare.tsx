"use client";

import React from "react";
import ScriptViewCanvas from "./svg/ScriptViewCanvas";
import { diffScripts } from "@/lib/diff/diffScripts";
import { Node, Connector } from "../lib/interface";
import SVGCanvasD3 from "./svg/SvgCanvasD3";

interface CompareProps {
    oldNodes: Node[];
    oldConnectors: Connector[];
    newNodes: Node[];
    newConnectors: Connector[];
}

const ScriptCompare: React.FC<CompareProps> = ({
    oldNodes,
    oldConnectors,
    newNodes,
    newConnectors,
}) => {
    const { removedNodeIds, addedNodeIds } = diffScripts(oldNodes, newNodes);

    return (
        <div className="w-full p-4 border rounded-md bg-gray-100 dark:bg-neutral-900 justify-between">
            <div className="flex gap-4 p-2 justify-end border-b border-gray-300 dark:border-stone-600">
                <h3 className="text-sm text-green-700">Nodes Added: {addedNodeIds.size}</h3>
                <h3 className="text-sm text-red-700">Nodes Removed: {removedNodeIds.size}</h3>
            </div>
            <div className="grid grid-cols-2 justify-between py-2">
                {/* LEFT SIDE */}
                <div>
                    <ScriptViewCanvas
                        nodes={oldNodes}
                        connectors={oldConnectors}
                        width={600}
                        height={400}
                        highlightRemoved={removedNodeIds}
                    />
                </div>

                {/* RIGHT SIDE */}
                <div>
                    <ScriptViewCanvas
                        nodes={newNodes}
                        connectors={newConnectors}
                        width={600}
                        height={400}
                        highlightAdded={addedNodeIds}
                    />
                </div>
            </div>
            
        </div>
    );
};

export default ScriptCompare;