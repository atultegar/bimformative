"use client";

import { Connector, Node } from "@/app/lib/interface";
import { Button } from "@/components/ui/button";
import { renderGraph } from "@/lib/d3/graphRenderer";
import * as d3 from "d3";
import { Fullscreen, ScanSearch } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ScriptDiffCanvasProps {
    nodes: Node[];
    connectors: Connector[];
    width: number;
    height: number;
    highlightAdded?: Set<string>;
    highlightRemoved?: Set<string>;
    highlightChanged?: Set<string>;
}

function addCanvasGrid(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>){
    const defs = svg.append("defs");

    // small grid
    defs.append("pattern")
        .attr("id", "diffSmallGrid")
        .attr("width", 20)
        .attr("height", 20)
        .attr("patternUnits", "userSpaceOnUse")
        .append("path")
        .attr("d", "M 20 0 L 0 0 0 20")
        .attr("fill", "none")
        .attr("stroke", "rgba(148,163,184,0.08)")
        .attr("stroke-width", 1);

    // big grid
    const grid = defs
        .append("pattern")
        .attr("id", "diffGrid")
        .attr("width", 100)
        .attr("height", 100)
        .attr("patternUnits", "userSpaceOnUse")

    grid
        .append("rect")
        .attr("width", "100")
        .attr("height", "100")
        .attr("fill", "url(#diffSmallGrid)");

    grid
        .append("path")
        .attr("d", "M 100 0 L 0 0 0 100")
        .attr("fill", "none")
        .attr("stroke", "rgba(148,163,184,0.16)")
        .attr("stroke-width", 1.2);

    svg
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f9f9f9");

    svg
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "url(#diffGrid)");
}

const ScriptDiffCanvas: React.FC<ScriptDiffCanvasProps> = ({
    nodes,
    connectors,
    width,
    height,
    highlightAdded,
    highlightRemoved,
    highlightChanged,
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const containerRef = useRef<SVGGElement | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);

    const zoomToFit = useCallback(() => {
        if (!svgRef.current || !containerRef.current ||!zoomRef.current) return;

        const svgEl = svgRef.current;
        const containerEl = containerRef.current;

        const bbox = containerEl.getBBox();
        if (!bbox || !isFinite(bbox.width) || !isFinite(bbox.height)) return;
        if (bbox.width === 0 || bbox.height === 0) return;

        const padding = 40;

        const rect = svgEl.getBoundingClientRect();
        const svgW = rect.width || svgEl.clientWidth || width;
        const svgH = rect.height || svgEl.clientHeight ||height;

        const scaleX = svgW / (bbox.width + padding * 2);
        const scaleY = svgH / (bbox.height + padding * 2)

        const scale = Math.max(0.1, Math.min(10, Math.min(scaleX, scaleY)));

        const tx = svgW / 2 - scale * (bbox.x + bbox.width / 2);
        const ty = svgH / 2 - scale * (bbox.y + bbox.height / 2);

        const transform = d3.zoomIdentity.translate(tx,ty).scale(scale);
        
        d3.select(svgEl)
            .transition()
            .duration(650)
            .call((zoomRef.current as any).transform, transform);
    }, [width, height]);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        addCanvasGrid(svg);

        const container = renderGraph({
            svg,
            nodes,
            connectors,
            highlightAdded,
            highlightRemoved,
            highlightChanged,
        });

        containerRef.current = container.node();

        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 10])
            .on("zoom", (event) => {
                container.attr("transform", event.transform);
            });

        zoomRef.current = zoom;
        svg.call(zoom as any);

        requestAnimationFrame(() => zoomToFit());

        return () => {
            svg.on(".zoom", null);
        };
    }, [
        nodes,
        connectors,
        highlightAdded,
        highlightRemoved,
        highlightChanged,
        zoomToFit,
    ]);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(zoomToFit);
        });

        resizeObserver.observe(wrapperRef.current);

        return () => resizeObserver.disconnect();
    }, [zoomToFit]);

    const toggleFullScreen = () => {
        if (!wrapperRef.current) return;

        if (!document.fullscreenElement) {
            wrapperRef.current.requestFullscreen?.();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullScreen(false);
        }
    };

    return (
        <div 
            ref={wrapperRef} 
            className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-slate/950"
        >
            <div className="absolute right-2 top-2 z-10 flex gap-2 rounded-md border border-white/10 bg-black/60 p-1 backdrop-blur">
                <Button size="sm" variant="ghost" onClick={zoomToFit}>
                    <ScanSearch className="mr-1 h-4 w-4" />
                    Fit
                </Button>

                <Button size="sm" variant="ghost" onClick={toggleFullScreen}>
                    <Fullscreen className="mr-1 h-4 w-4" />
                    {isFullScreen ? "Exit" : "Full"}
                </Button>
            </div>

            <svg
                ref={svgRef}
                width={isFullScreen ? "100%" : width}
                height={isFullScreen ? "100%" : height}
                className="cursor-grab"
            />
        </div>
    );
};

export default ScriptDiffCanvas;