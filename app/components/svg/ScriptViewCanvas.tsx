// ScriptViewcanvas
"use client";

import React, {useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Node, InputOutput, Connector } from "@/app/lib/interface";
import { Button } from "@/components/ui/button";
import { ScanSearch, Save, Fullscreen } from "lucide-react";
import { set } from "zod";

interface ScriptViewCanvasProps {
    nodes: Array<Node>;
    connectors: Array<Connector>,
    width: number;
    height: number;
    highlightAdded?: Set<string>;
    highlightRemoved?: Set<string>;
}

function rounded_rect(x: number, y:number, w:number, h:number, r:number, tl:boolean, tr:boolean, bl:boolean, br:boolean) {
    let retval;
    retval  = "M" + (x + r) + "," + y;
    retval += "h" + (w - 2*r);
    if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
    else { retval += "h" + r; retval += "v" + r; }
    retval += "v" + (h - 2*r);
    if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
    else { retval += "v" + r; retval += "h" + -r; }
    retval += "h" + (2*r - w);
    if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
    else { retval += "h" + -r; retval += "v" + -r; }
    retval += "v" + (2*r - h);
    if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
    else { retval += "v" + -r; retval += "h" + r; }
    retval += "z";
    return retval;
}

const ScriptViewCanvas: React.FC<ScriptViewCanvasProps> = ({
    nodes,
    connectors,
    width,
    height,
    highlightAdded,
    highlightRemoved,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const container = svg.append("g");
        const nodeGroup = container.append("g").attr("class", "nodes");
        const connectorGroup = container.append("g").attr("class", "connectors");

        // Zoom and Pan setup
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 10])
            .on("zoom", (event) => {
                nodeGroup.attr("transform", event.transform);
                connectorGroup.attr("transform", event.transform);
        });

        svg.call(zoom);

        // Zoom to fit function
        function zoomToFit() {
            const bbox = container.node()?.getBBox();
            const padding = 20;
            
            if (bbox) {
                const newViewBox = [
                    bbox.x - padding,
                    bbox.y - padding,
                    bbox.width + 2 * padding,
                    bbox.height + 2 * padding
                ].join(" ");
                svg.transition().duration(750).attr("viewBox", newViewBox);
            }

        }

        // Attach handlers to window for easy access
        (window as any).zoomToFit = zoomToFit;
        

        // Draw connectors
        const colors = d3.scaleSequential(d3.interpolateHslLong("purple", "orange"))
                .domain([0, connectors.length - 1]);

        connectors.forEach((c, index) => {
            const color = colors(index);
            connectorGroup
                .append("path")
                .attr(
                    "d",
                    `M ${c.StartX} ${c.StartY} C ${c.StartX + 50} ${c.StartY} ${c.EndX - 50} ${c.EndY} ${c.EndX} ${c.EndY}`
                )
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 2);
            const startCircle = connectorGroup.append("circle")
                .attr("cx", c.StartX)
                .attr("cy", c.StartY)
                .attr("r", 5)
                .attr("fill", color);
            
            const endCircle = connectorGroup.append("circle")
                .attr("cx", c.EndX)
                .attr("cy", c.EndY)
                .attr("r", 5)
                .attr("fill", color);
        });

        // Draw nodes
        nodes.forEach((node) => {
            const highlightColor = highlightAdded?.has(node.Id)
                ? "rgba(23,130,3,1)" // green
                : highlightRemoved?.has(node.Id)
                ? "rgba(222,73,84,1)" // red
                : "none";

            const highlightHeaderColor = highlightAdded?.has(node.Id)
                ? "rgba(23,130,3,0.5)" // green
                : highlightRemoved?.has(node.Id)
                ? "rgba(222,73,84,0.8)" // red
                : "none";

            const headerRect = nodeGroup.append("rect")
                    .attr("x", node.X)
                    .attr("y", node.Y)
                    .attr("width", node.Width)
                    .attr("height", 50)
                    .attr("rx", 10)
                    .attr("fill", highlightHeaderColor === "none" ? "rgba(83, 83, 83, 1)" : highlightHeaderColor);

            const bodyRect = nodeGroup.append("rect")
                .attr("x", node.X)
                .attr("y", node.Y + 40)
                .attr("width", node.Width)
                .attr("height", node.Height - 40)
                .attr("fill", highlightColor === "none" ? "rgba(60, 60, 60, 1)" : highlightColor);

            const text = nodeGroup.append("text")
                .attr("x", node.X + 15)
                .attr("y", node.Y + 20)
                .attr("font-size", 14)
                .attr("dominant-baseline", "middle")
                .attr("fill", "white")
                .text(node.Name);
            
            const inputs = node.Inputs.map((input, index) => {
                const rightRoundRect = nodeGroup.append("path")
                    .attr("d", rounded_rect(input.X, input.Y, input.Width, 25, 10, false, true, false, true))
                    .attr("fill", "rgba(60, 60, 60, 0.9)")
                    .attr("stroke", "gray")
                    .attr("stroke-width", 1);                                       

                const text = nodeGroup.append("text")
                    .attr("x", input.X + 10)
                    .attr("y", input.Y + 12.5)
                    .attr("font-size", 12)
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .attr("opacity", 0.8)
                    .text(input.Name);
                
                const arrow = nodeGroup.append("text")
                    .attr("x", input.X + input.Width - 5)
                    .attr("y", input.Y + 12.5)
                    .attr("font-size", 12)
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .attr("opacity", 0.8)
                    .attr("text-anchor", "end")
                    .text(">");                                        

                const startRect = nodeGroup.append("rect")
                    .attr("x", input.X)
                    .attr("y", input.Y)
                    .attr("width", 5)
                    .attr("height", 25)
                    .attr("fill", "rgba(106, 192, 231, 1)")
                    .attr("stroke", "rgba(106, 192, 231, 1)")
                    .attr("stroke-width", 1);
            }, []);

            const outputs = node.Outputs.map((output, index) => {                    

                const leftRoundRect = nodeGroup.append("path")
                    .attr("d", rounded_rect(output.X - output.Width, output.Y, output.Width, 25, 10, true, false, true, false))
                    .attr("fill", "rgba(60, 60, 60, 0.9)")
                    .attr("stroke", "gray")
                    .attr("stroke-width", 1);
                
                const text = nodeGroup.append("text")
                    .attr("x", output.X - output.Width + 10)
                    .attr("y", output.Y + 12.5)
                    .attr("font-size", 12)
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .attr("opacity", 0.8)
                    .text(output.Name);
            }, []);
            
            if (node.InputValueWidth > 0) {
                nodeGroup.append("rect")
                    .attr("x", node.X + node.Width - node.InputValueWidth - 25)
                    .attr("y", node.Y + 45)
                    .attr("width", node.InputValueWidth)
                    .attr("height", 25)
                    .attr("fill", "rgba(60, 60, 60, 0.9)")
                    .attr("stroke", "gray");
                nodeGroup.append("text")
                    .attr("x", node.X + node.Width - node.InputValueWidth - 20)
                    .attr("y", node.Y + 45 + 12.5)
                    .attr("font-size", 12)
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .text(node.InputValue);
            }
        });
        nodeGroup.raise();
        zoomToFit();
    }, [nodes, connectors, highlightAdded, highlightRemoved]);

    function toggleFullScreen(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (!document.fullscreenElement) {
            if (wrapperRef.current?.requestFullscreen) {
                wrapperRef.current.requestFullscreen();
            }
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullScreen(false);
        }
    }

    return (
        <div ref={wrapperRef} className="relative w-full" >
            {/* Toolbar */ }            
            <div className="absolute top-0 right-0 bg-gray-300 dark:bg-stone-900 p-1 z-10 flex justify-end border-gray-950 border-1">
                <Button variant="ghost" onClick={() => (window as any).zoomToFit()} className="mr-4">
                    <ScanSearch/>Zoom to Fit
                </Button>                
                <Button variant="ghost" onClick={toggleFullScreen} className="mr-4">
                    {isFullScreen ? <Fullscreen/> :<Fullscreen />}
                    {isFullScreen ? "Exit Fullscreen" : "Full Screen" }
                </Button>                
            </div>
            <svg 
            ref={svgRef} 
            width={isFullScreen ? "100%": width} 
            height={isFullScreen? "100%": height}
            style={{ 
                border: "1px solid gray", 
                backgroundColor: '#f9f9f9',
                backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
                cursor: "grab"}} />
        </div>           
    );
};

export default ScriptViewCanvas;