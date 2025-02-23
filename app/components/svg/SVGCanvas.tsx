"use client";
import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import { Node, InputOutput, Connector } from "@/app/lib/interface";

interface RectProps {
    id: string;
    x: number;
    y: number;
    label?: string;
    inputs: Array<InputOutput>;
    outputs: Array<InputOutput>;
}

const ConnectorCurve: React.FC<Connector> = ({
    Id,
    StartX,
    StartY,
    EndX,
    EndY,
}) => {
    return (
        <path
            d={`M ${StartX} ${StartY} C ${StartX+50} ${StartY} ${EndX-50} ${EndY} ${EndX} ${EndY}`}
            fill="none"
            stroke="gray"
            strokeWidth="2"
        />
    );
};

const NodeRect: React.FC<Node> = ({
    Id,
    Name,
    X,
    Y,
    Width,
    Height,
    Inputs,
    Outputs, 
}) => {    
    return (
        <>
            <rect
                x={X}
                y={Y}
                width={Width}
                height={50}
                rx="10"
                fill="rgba(83, 83, 83, 1)"
                stroke="black"
                strokeWidth="0"
            />
            <rect
                x={X}
                y={Y+40}
                width={Width}
                height={Height - 40}
                fill="rgba(60, 60, 60, 1)"
                stroke="black"
                strokeWidth="0"
            />
            {Name && (
                <text
                    x={X + 15}
                    y={Y + 20}
                    fontSize="14"
                    dominantBaseline="middle"
                    fill="white"
                    opacity={0.8}
                >
                    {Name}
                </text>
            )}
            {Inputs.map((input, index) => (
                <g key={index}>
                    <rect
                        x={input.X}
                        y={input.Y}
                        rx={10}
                        ry={10}
                        width={input.Width}
                        height={25}
                        fill="rgba(60, 60, 60, 0.9)"
                        stroke="gray"
                        strokeWidth="1"
                    />
                    rightRoundedRect(x: input.X, y: input.Y, width: input.Width, height: 25, radius: 10)
                    <text
                        x={input.X + 10}
                        y={input.Y + 12.5}
                        fontSize="12"
                        dominantBaseline="middle"
                        fill="white"
                        opacity={0.8}
                    >
                        {input.Name}
                    </text>
                    <text
                        x={input.X + input.Width - 5}
                        y={input.Y + 12.5}
                        fontSize="12"
                        dominantBaseline="middle"
                        fill="white"
                        opacity={0.8}
                        textAnchor="end">
                            >
                    </text>
                </g>
            ))}
            {Outputs.map((output, index) => (
                <g key={index}>                    
                    
                    <rect
                        x={output.X - output.Width}
                        y={output.Y}
                        rx={10}
                        ry={10}
                        width={output.Width}
                        height={25}
                        fill="rgba(60, 60, 60, 0.9)"
                        stroke="gray"
                        strokeWidth="1"
                    />
                    <text
                        x={output.X - output.Width + 10}
                        y={output.Y + 12.5}
                        fontSize="12"
                        dominantBaseline="middle"
                        fill="white"
                        opacity={0.8}
                    >
                        {output.Name}
                    </text>
                </g>
            ))}
        </>
    );
};

interface rightRoundedRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
}

const rightRoundedRect: React.FC<rightRoundedRectProps> = ({x, y, width, height, radius}) => {
    return "M" + x + "," + y
        + "h" + (width - radius)
        + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
        + "v" + (height - 2 * radius)
        + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
        + "h" + (radius - width)
        + "z";
}

interface SVGCanvasProps {
    nodes: Node[];
    connectors?: Connector[];
    canvasWidth: number;
    canvasHeight: number;
}

const SVGCanvas: React.FC<SVGCanvasProps> = ({ nodes, connectors, canvasWidth, canvasHeight }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [viewBox, setViewBox] = useState({ x:0, y:0, width:canvasWidth, height:canvasHeight });
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x:0, y:0 });

    // Handle Zoom
    const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
        event.preventDefault();
        const scaleAmount = event.deltaY > 0 ? 1.1 : 0.9; // Zoom in or out
        const mouseX = event.clientX - svgRef.current!.getBoundingClientRect().left;
        const mouseY = event.clientY - svgRef.current!.getBoundingClientRect().top;

        const svgX = (mouseX / canvasWidth) * viewBox.width + viewBox.x;
        const svgY = (mouseY / canvasHeight) * viewBox.height + viewBox.y;

        setViewBox(prev =>({
            ...prev,
            width: prev.width * scaleAmount,
            height: prev.height * scaleAmount,
        }));
    };

    // Handle Pan
    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
        setIsPanning(true);
        setStartPoint({x: event.clientX, y: event.clientY});
    };

    //Handle Panning move
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!isPanning) return;

        const dx = (startPoint.x - event.clientX) * (viewBox.width / canvasWidth);
        const dy = (startPoint.y - event.clientY) * (viewBox.height / canvasHeight);

        setViewBox((prev) => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy,
        }));

        setStartPoint({x: event.clientX, y: event.clientY});
        };
    
    // Handle Panning End
    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // "Zoom All" button - Fit all nodes in the view
    const zoomToFit = () => {
        if (!nodes.length) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        nodes.forEach(({ X, Y, Width, Height}) => {
            minX = Math.min(minX, X);
            minY = Math.min(minY, Y);
            maxX = Math.max(maxX, X + Width);
            maxY = Math.max(maxY, Y + Height);
        });

        // Add padding around the elements
        const padding = 20;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        setViewBox({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        });
    };

    useEffect(() => {
        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener("wheel", handleWheel, {passive: false});
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener("wheel", handleWheel);
            }
        };
    }, [viewBox]);

    return (
        <svg 
            ref={svgRef}
            width={canvasWidth} 
            height={canvasHeight} 
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}            
            style={{ 
                border: "1px solid black", 
                backgroundColor: "#f9f9f9", 
                backgroundImage: "linear-gradient(120deg, #f3e7e9 0%, #e3eeff 100%)", 
                cursor: isPanning ? "grabbing" : "grab", 
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            
            {nodes.map((rect, index) => (
                <NodeRect key={index} {...rect} />
            ))}
            {connectors?.map((curve, index) => (
                <ConnectorCurve key={index} {...curve} />
            ))}

            <g onClick={zoomToFit} style={{ cursor: "pointer" }}>
                <rect x={viewBox.x + 10} y={viewBox.y + 10} width={80} height={30} fill="white" stroke="black" />
                <text x={viewBox.x + 20} y={viewBox.y + 30} fontSize="14" fill="black" >
                    Zoom All
                </text>
            </g>
        </svg>
    );
};

export default SVGCanvas;