"use client";

import React, { useEffect, useRef, useState } from "react";
import ScriptViewCanvas from "./svg/ScriptViewCanvas";
import { diffScripts } from "@/lib/diff/diffScripts";
import { Node, Connector } from "../lib/interface";

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
    const { removedNodeIds, addedNodeIds, changedNodeIds } = diffScripts(oldNodes, newNodes);

    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const [canvasWidth, setCanvasWidth] = useState(600);

    useEffect(() => {
        function updateWidth() {
            if (leftRef.current) {
                const width = leftRef.current.offsetWidth;
                setCanvasWidth(width);
            }
        }

        // Observe resizing
        const observer = new ResizeObserver(updateWidth);
        if (leftRef.current) observer.observe(leftRef.current);

        updateWidth();

        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full p-4 border rounded-md bg-gray-100 dark:bg-neutral-900 justify-between">
            <div className="flex gap-4 pb-2 justify-end border-b border-gray-300 dark:border-stone-600">
                <h3 className="text-sm text-green-700">Added: {addedNodeIds.size}</h3>
                <h3 className="text-sm text-red-700">Removed: {removedNodeIds.size}</h3>
                <h3 className="text-sm text-blue-700">Changed: {changedNodeIds.size}</h3>

            </div>
            <div className="grid grid-cols-2 justify-between py-2">
                {/* LEFT SIDE */}
                <div ref={leftRef}>
                    <ScriptViewCanvas
                        nodes={oldNodes}
                        connectors={oldConnectors}
                        width={canvasWidth}
                        height={400}
                        highlightRemoved={removedNodeIds}
                        highlightChanged={changedNodeIds}
                    />
                </div>

                {/* RIGHT SIDE */}
                <div ref={rightRef}>
                    <ScriptViewCanvas
                        nodes={newNodes}
                        connectors={newConnectors}
                        width={canvasWidth}
                        height={400}
                        highlightAdded={addedNodeIds}
                        highlightChanged={changedNodeIds}
                    />
                </div>
            </div>
            
        </div>
    );
};

export default ScriptCompare;