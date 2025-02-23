"use client";

import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import { Node, InputOutput, Connector } from "@/app/lib/interface";
import { Button } from "@/components/ui/button";
import { ScanSearch, Save } from "lucide-react";

interface SVGCanvasD3Props {
    nodes: Array<Node>;
    connectors: Array<Connector>;
    canvasWidth: number;
    canvasHeight: number;
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

const SVGCanvasD3: React.FC<SVGCanvasD3Props> = ({ nodes, connectors, canvasWidth, canvasHeight }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // Clear the canvas

            const container = svg.append("g");
            
            const nodeGroup = container.append("g").attr("class", "nodes");
            const connectorGroup = container.append("g").attr("class", "connectors");

            // Zoom and Pan setup
            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.1, 5])
                .on("zoom", (event) => {
                    nodeGroup.attr("transform", event.transform);
                    connectorGroup.attr("transform", event.transform);
            });

            svg.call(zoom);

            // Zoom to fit Function
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

            // Export as PNG/JPG
            const exportImage = (format: "png" | "jpg") => {
                const svgElement = svgRef.current;
                if (!svgElement) return;

                const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

                // Embed font styles inside SVG
                const embedFontStyles = (svg: SVGSVGElement) => {
                    const style = document.createElement("style");                    
                    const svgTextElements = svg.querySelectorAll("text");
                    let css = "";

                    svgTextElements.forEach((textElement) => {
                        const computedStyle = window.getComputedStyle(textElement);
                        css += `
                            text {
                                font-family: ${computedStyle.fontFamily};
                                font-size: ${computedStyle.fontSize};
                                font-weight: ${computedStyle.fontWeight};
                                fill: ${computedStyle.fill};
                            }`;
                            
                            
                    });
                    style.innerHTML = css;
                    svg.insertBefore(style, svg.firstChild);
                };

                embedFontStyles(clonedSvg);

                const serailizer = new XMLSerializer();
                const svgString = serailizer.serializeToString(clonedSvg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();

                const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);

                img.onload = () => {
                    canvas.width = svgElement.clientWidth;
                    canvas.height = svgElement.clientHeight;
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    ctx?.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);

                    const link = document.createElement("a");
                    link.href = canvas.toDataURL(`image/${format}`);
                    link.download = `canvas.${format}`;
                    link.click();
                };
                img.src = url;
            };

            // Attach handlers to window for easy access
            (window as any).zoomToFit = zoomToFit;
            (window as any).exportImage = exportImage;

            const colors = d3.scaleSequential(d3.interpolateHslLong("purple", "orange"))
                .domain([0, connectors.length - 1]);


            connectors.forEach((connector, index) => {
                const color = colors(index);
                const path = connectorGroup.append("path")
                    .attr("d", `M ${connector.StartX} ${connector.StartY} C ${connector.StartX+50} ${connector.StartY} ${connector.EndX-50} ${connector.EndY} ${connector.EndX} ${connector.EndY}`)
                    .attr("fill", "none")
                    .attr("stroke", color)
                    .attr("stroke-width", 2);
                
                const startCircle = connectorGroup.append("circle")
                    .attr("cx", connector.StartX)
                    .attr("cy", connector.StartY)
                    .attr("r", 5)
                    .attr("fill", color);
                
                const endCircle = connectorGroup.append("circle")
                    .attr("cx", connector.EndX)
                    .attr("cy", connector.EndY)
                    .attr("r", 5)
                    .attr("fill", color);
            });

            nodes.forEach((node) => {
                const headerRect = nodeGroup.append("rect")
                    .attr("x", node.X)
                    .attr("y", node.Y)
                    .attr("width", node.Width)
                    .attr("height", 50)
                    .attr("rx", 10)
                    .attr("fill", "rgba(83, 83, 83, 1)");

                const bodyRect = nodeGroup.append("rect")
                    .attr("x", node.X)
                    .attr("y", node.Y + 40)
                    .attr("width", node.Width)
                    .attr("height", node.Height - 40)
                    .attr("fill", "rgba(60, 60, 60, 1)");

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
        }
    }, [connectors, nodes]);

    return (
        <div ref={wrapperRef} className="relative w-full" >
            {/* Toolbar */ }            
            <div className="absolute bg-gray-300 dark:bg-stone-900 p-2 z-10 flex justify-end border-gray-500 border-2">
                <Button variant="ghost" onClick={() => (window as any).zoomToFit()} className="mr-4">
                    <ScanSearch/>Zoom to Fit
                </Button>
                <Button variant="ghost" onClick={() => (window as any).exportImage("png")} className="mr-4">
                    <Save/>Save as PNG
                </Button>
                <Button variant="ghost" onClick={() => (window as any).exportImage("jpg")}>
                    <Save/>Save as JPG
                </Button>
            </div>
            <svg 
            ref={svgRef} 
            width={canvasWidth} 
            height={canvasHeight}
            style={{ 
                border: "2px solid gray", 
                backgroundColor: '#f9f9f9',
                backgroundImage: "linear-gradient(120deg, #f3e7e9 0%, #e3eeff 100%)",
                cursor: "grab"}} />

        </div>
        
    );
};

export default SVGCanvasD3;