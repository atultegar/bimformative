"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import { Node, Connector } from "@/app/lib/interface";
import { Button } from "@/components/ui/button";
import { ScanSearch, Save, Fullscreen } from "lucide-react";
import { renderGraph } from "@/lib/d3/graphRenderer";

interface SVGCanvasD3Props {
    nodes: Array<Node>;
    connectors: Array<Connector>;
    canvasWidth: number;
    canvasHeight: number;
}

const SVGCanvasD3: React.FC<SVGCanvasD3Props> = ({ 
    nodes, 
    connectors, 
    canvasWidth, 
    canvasHeight 
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const containerRef = useRef<SVGGElement | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);

    // Zoom to Fit
    const zoomToFit = useCallback(() => {
        if (!svgRef.current || !containerRef.current ||!zoomRef.current) return;

        const svgEl = svgRef.current;
        const containerEl = containerRef.current;

        const bbox = containerEl.getBBox();
        if (!bbox.width || !bbox.height) return;

        const padding = 40;

        const rect = svgEl.getBoundingClientRect();
        const svgW = rect.width || canvasWidth;
        const svgH = rect.height || canvasHeight;

        const scale = Math.min(
            svgW / (bbox.width + padding),
            svgH / (bbox.height + padding)
        );

        const midX = svgW / 2;
        const midY = svgH / 2;

        const transform = d3.zoomIdentity
            .translate(
                midX - scale * (bbox.x + bbox.width / 2),
                midY - scale * (bbox.y + bbox.height / 2)
            )
            .scale(scale);
        
        d3.select(svgEl)
            .transition()
            .duration(600)
            .call((zoomRef.current as any).transform, transform);
    }, [canvasWidth, canvasHeight]);

    // Render Graph
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const defs = svg.append("defs");

        // small grid
        defs.append("pattern")
            .attr("id", "smallGrid")
            .attr("width", 20)
            .attr("height", 20)
            .attr("patternUnits", "userSpaceOnUse")
            .append("path")
            .attr("d", "M 20 0 L 0 0 0 20")
            .attr("fill", "none")
            .attr("stroke", "rgba(148,163,184,0.08)")
            .attr("stroke-width", 1);

        // big grid
        defs.append("pattern")
            .attr("id", "grid")
            .attr("width", 100)
            .attr("height", 100)
            .attr("patternUnits", "userSpaceOnUse")
            .append("rect")
            .attr("width", 100)
            .attr("height", 100)
            .attr("fill", "url(#smallGrid)");

        defs.select("#grid")
            .append("path")
            .attr("d", "M 100 0 L 0 0 0 100")
            .attr("fill", "none")
            .attr("stroke", "rgba(148,163,184,0.18)")
            .attr("stroke-width", 1.2);

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#f9f9f9");

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "url(#grid)");        

        const container = renderGraph({
            svg,
            nodes,
            connectors,
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
    }, [nodes, connectors, zoomToFit]);

    // Resize observer
    useEffect(() => {
        if (!wrapperRef.current) return;

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(zoomToFit);
        });

        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [zoomToFit]);

    // Fullscreen
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

    // Export Image
    const exportImage = (format: "png" | ".jpg") => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const blob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);

        img.onload = () => {
            canvas.width = svgElement.clientWidth;
            canvas.height = svgElement.clientHeight;

            ctx?.drawImage(img, 0, 0);

            URL.revokeObjectURL(url);

            const link = document.createElement("a");
            link.download = `graph.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
            link.click();
        };

        img.src = url;
    };

    return (
        <div ref={wrapperRef} className="relative w-full" >

            {/* Toolbar */ }            
            <div className="absolute right-2 top-2 z-10 flex gap-2 rounded-md border border-white/10 bg-black/60 p-1 backdrop-blur">

                <Button size="sm" variant="ghost" onClick={zoomToFit}>
                    <ScanSearch className="mr-1 h-4 w-4" />
                    Fit
                </Button>

                <Button size="sm" variant="ghost" onClick={() => exportImage("png")}>
                    <Save className="mr-1 h-4 w-4"/>
                    PNG
                </Button>

                <Button size="sm" variant="ghost" onClick={toggleFullScreen}>
                    <Fullscreen className="mr-1 h-4 w-4" />
                    {isFullScreen ? "Exit" : "Full" }
                </Button>                
            </div>

            {/* Canvas */}
            <svg 
                ref={svgRef} 
                width={isFullScreen ? "100%": canvasWidth} 
                height={isFullScreen? "100%": canvasHeight}
                className="cursor-grab border border-white/10"
            />
        </div>        
    );
};

export default SVGCanvasD3;