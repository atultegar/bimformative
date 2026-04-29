"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { diffScripts } from "@/lib/diff/diffScripts";
import { Node, Connector } from "../lib/interface";
import ScriptDiffCanvas from "./svg/ScriptDiffCanvas";
import { Badge } from "@/components/ui/badge";

interface CompareProps {
    oldNodes: Node[];
    oldConnectors: Connector[];
    newNodes: Node[];
    newConnectors: Connector[];
}

const CANVAS_HEIGHT = 520;

const ScriptCompare: React.FC<CompareProps> = ({
    oldNodes,
    oldConnectors,
    newNodes,
    newConnectors,
}) => {
    const { removedNodeIds, addedNodeIds, changedNodeIds } = useMemo(
        () => diffScripts(oldNodes, newNodes),
        [oldNodes, newNodes]
    );

    const leftRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(600);

    useEffect(() => {
        if (!leftRef.current) return;

        const updateWidth = () => {
            if (!leftRef.current) return;
            setCanvasWidth(Math.max(420, leftRef.current.offsetWidth));
        };

        // Observe resizing
        const observer = new ResizeObserver(updateWidth);
        observer.observe(leftRef.current);

        updateWidth();

        return () => observer.disconnect();
    }, []);

    return (
        <section className="w-full overflow-hidden rounded-xl border border-white/10 bg-gray-200/60 dark:bg-slate-950/60 p-4 backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-800/10 dark:border-white/10 pb-4 md:flex-row md:items-center md:justify-between">                
                <div>

                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/10">
                        Added: {addedNodeIds.size}
                    </Badge>
                    <Badge className="bg-red-500/10 text-red-400 hover:bg-red-500/10">
                        Removed: {removedNodeIds.size}
                    </Badge>
                    <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/10">
                        Changed: {changedNodeIds.size}
                    </Badge>
                </div>
            </div>

            {/* Canvas titles */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Previous Version
                        </h3>
                        <Badge variant="outline" className="border-red-500/30 text-red-400">
                            Removed / Changed
                        </Badge>
                    </div>

                    <div ref={leftRef}>
                        <ScriptDiffCanvas
                            nodes={oldNodes}
                            connectors={oldConnectors}
                            width={canvasWidth}
                            height={CANVAS_HEIGHT}
                            highlightRemoved={removedNodeIds}
                            highlightChanged={changedNodeIds}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            New Version
                        </h3>
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                            Added / Changed
                        </Badge>
                    </div>

                    <ScriptDiffCanvas
                        nodes={newNodes}
                        connectors={newConnectors}
                        width={canvasWidth}
                        height={CANVAS_HEIGHT}
                        highlightAdded={addedNodeIds}
                        highlightChanged={changedNodeIds}
                    />
                </div>
            </div>
        </section>
    );
};

export default ScriptCompare;