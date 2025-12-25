// ScriptViewCanvas.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Node, Connector } from "@/app/lib/interface";
import { Button } from "@/components/ui/button";
import { ScanSearch, Fullscreen } from "lucide-react";

interface ScriptViewCanvasProps {
  nodes: Array<Node>;
  connectors: Array<Connector>;
  width: number;
  height: number;
  highlightAdded?: Set<string>;
  highlightRemoved?: Set<string>;
  highlightChanged?: Set<string>;
}

function rounded_rect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  tl: boolean,
  tr: boolean,
  bl: boolean,
  br: boolean
) {
  let retval;
  retval = "M" + (x + r) + "," + y;
  retval += "h" + (w - 2 * r);
  if (tr) {
    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
  } else {
    retval += "h" + r;
    retval += "v" + r;
  }
  retval += "v" + (h - 2 * r);
  if (br) {
    retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
  } else {
    retval += "v" + r;
    retval += "h" + -r;
  }
  retval += "h" + (2 * r - w);
  if (bl) {
    retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
  } else {
    retval += "h" + -r;
    retval += "v" + -r;
  }
  retval += "v" + (2 * r - h);
  if (tl) {
    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
  } else {
    retval += "v" + -r;
    retval += "h" + r;
  }
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
  highlightChanged,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // store zoom behavior & container <g>
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const containerRef = useRef<SVGGElement | null>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);

  // draw/update function
  useEffect(() => {
    if (!svgRef.current) return;

    // create a typed d3 selection from the DOM node
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    // clear previous content
    svg.selectAll("*").remove();

    // create container groups
    const container = svg.append("g").attr("class", "container");
    const nodeGroup = container.append("g").attr("class", "nodes");
    const connectorGroup = container.append("g").attr("class", "connectors");

    // store container DOM node for bbox calculations
    containerRef.current = container.node() as SVGGElement | null;

    // create zoom behavior (one per instance)
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        // apply transform to container <g>
        container.attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom as any);

    // draw connectors and nodes
    drawConnectors(connectorGroup, connectors);
    drawNodes(nodeGroup, nodes, {
      highlightAdded,
      highlightRemoved,
      highlightChanged,
    });

    // initially zoom to fit *after* drawing
    // use setTimeout(0) to allow browser to paint in tricky cases (optional)
    // but typically calling right away works because elements are appended synchronously.
    setTimeout(() => {
      zoomToFit();
    }, 0);

    // cleanup: remove listeners if component unmounts
    return () => {
      try {
        svg.on(".zoom", null);
      } catch {
        /* ignore */
      }
    };
    // we intentionally re-run when nodes/connectors/highlight sets change
  }, [nodes, connectors, highlightAdded, highlightRemoved, highlightChanged]);

  // Zoom-to-fit implementation that uses zoom.transform so zoom state is consistent
  const zoomToFit = () => {
    if (!svgRef.current || !containerRef.current || !zoomRef.current) return;

    const svgEl = svgRef.current;
    const containerEl = containerRef.current;

    // get bbox of content
    const bbox = containerEl.getBBox();
    if (!bbox || !isFinite(bbox.width) || !isFinite(bbox.height)) return;

    // padding
    const padding = 40;

    // compute svg display size (use bounding client rect to account for CSS)
    const rect = svgEl.getBoundingClientRect();
    const svgW = rect.width || svgEl.clientWidth || width;
    const svgH = rect.height || svgEl.clientHeight || height;

    // compute scale and clamp to zoom extent
    const scaleX = svgW / (bbox.width + padding * 2);
    const scaleY = svgH / (bbox.height + padding * 2);
    let scale = Math.min(scaleX, scaleY);

    // clamp with the zoom's scaleExtent if available
    // (zoomRef.current has internal state but we can reuse the same extents we set earlier)
    const minScale = 0.1;
    const maxScale = 10;
    scale = Math.max(minScale, Math.min(maxScale, scale));

    // center translation
    const midX = svgW / 2;
    const midY = svgH / 2;
    const bboxCenterX = bbox.x + bbox.width / 2;
    const bboxCenterY = bbox.y + bbox.height / 2;

    const tx = midX - scale * bboxCenterX;
    const ty = midY - scale * bboxCenterY;

    const transform = d3.zoomIdentity.translate(tx, ty).scale(scale);

    const svg = d3.select(svgEl);

    // apply animated transform using the zoom behavior so its internal state updates
    svg
      .transition()
      .duration(650)
      // cast is required to satisfy TS because d3 typings are strict for .call with transform
      .call((zoomRef.current as unknown as any).transform, transform);
  };

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

  // Optional: auto-zoom-to-fit when container resizes (useful in responsive layouts)
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(() => {
      // small debounce
      requestAnimationFrame(() => zoomToFit());
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Toolbar */}
      <div className="absolute top-0 right-0 bg-gray-300 dark:bg-stone-900 p-1 z-10 flex gap-3 border-gray-950 border-1">
        <Button
          variant="ghost"
          onClick={() => {
            zoomToFit();
          }}
          className="mr-4"
        >
          <ScanSearch />
          Zoom to Fit
        </Button>
        <Button variant="ghost" onClick={toggleFullScreen} className="mr-4">
          <Fullscreen />
          {isFullScreen ? "Exit Fullscreen" : "Full Screen"}
        </Button>
      </div>

      <svg
        ref={(el) => {
          // keep svgRef typed and stable
          svgRef.current = el;
        }}
        width={isFullScreen ? "100%" : width}
        height={isFullScreen ? "100%" : height}
        style={{
          border: "1px solid gray",
          backgroundColor: "#f9f9f9",
          backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
          cursor: "grab",
        }}
      />
    </div>
  );
};

// Drawing Helpers

function drawConnectors(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  connectors: Connector[]
) {
  connectors.forEach((c) => {
    const color = "rgba(83, 83, 83, 1)";

    group
      .append("path")
      .attr(
        "d",
        `M ${c.StartX} ${c.StartY} C ${c.StartX + 50} ${c.StartY} ${c.EndX - 50} ${c.EndY} ${c.EndX} ${c.EndY}`
      )
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2);

    group
      .append("circle")
      .attr("cx", c.StartX)
      .attr("cy", c.StartY)
      .attr("r", 5)
      .attr("fill", color);

    group
      .append("circle")
      .attr("cx", c.EndX)
      .attr("cy", c.EndY)
      .attr("r", 5)
      .attr("fill", color);
  });
}

function drawNodes(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  { highlightAdded, highlightRemoved, highlightChanged }: any
) {
  nodes.forEach((node) => {
    const highlightColor = highlightAdded?.has(node.Id)
      ? "rgba(23,130,3,1)"
      : highlightRemoved?.has(node.Id)
      ? "rgba(222,73,84,1)"
      : highlightChanged?.has(node.Id)
      ? "rgba(7,69,255,1)"
      : "rgba(60, 60, 60, 1)";

    const headerColor = highlightAdded?.has(node.Id)
      ? "rgba(23,130,3,0.5)"
      : highlightRemoved?.has(node.Id)
      ? "rgba(222,73,84,0.8)"
      : highlightChanged?.has(node.Id)
      ? "rgba(7,69,255,0.6)"
      : "rgba(83, 83, 83, 1)";

    // Header
    group
      .append("rect")
      .attr("x", node.X)
      .attr("y", node.Y)
      .attr("width", node.Width)
      .attr("height", 50)
      .attr("rx", 10)
      .attr("fill", headerColor);

    // Body
    group
      .append("rect")
      .attr("x", node.X)
      .attr("y", node.Y + 40)
      .attr("width", node.Width)
      .attr("height", node.Height - 40)
      .attr("fill", highlightColor);

    // Title Text
    group
      .append("text")
      .attr("x", node.X + 15)
      .attr("y", node.Y + 20)
      .attr("font-size", 14)
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .text(node.Name);

    // Inputs
    node.Inputs.forEach((input: any) => {
      group
        .append("path")
        .attr("d", rounded_rect(input.X, input.Y, input.Width, 25, 10, false, true, false, true))
        .attr("fill", "rgba(60, 60, 60, 0.9)")
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

      group
        .append("text")
        .attr("x", input.X + 10)
        .attr("y", input.Y + 12.5)
        .attr("font-size", 12)
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .attr("opacity", 0.8)
        .text(input.Name);

      group
        .append("text")
        .attr("x", input.X + input.Width - 5)
        .attr("y", input.Y + 12.5)
        .attr("font-size", 12)
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .attr("opacity", 0.8)
        .attr("text-anchor", "end")
        .text(">");

      group
        .append("rect")
        .attr("x", input.X)
        .attr("y", input.Y)
        .attr("width", 5)
        .attr("height", 25)
        .attr("fill", "rgba(106, 192, 231, 1)")
        .attr("stroke", "rgba(106, 192, 231, 1)")
        .attr("stroke-width", 1);
    });

    // Outputs
    node.Outputs.forEach((output: any) => {
      group
        .append("path")
        .attr("d", rounded_rect(output.X - output.Width, output.Y, output.Width, 25, 10, true, false, true, false))
        .attr("fill", "rgba(60, 60, 60, 0.9)")
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

      group
        .append("text")
        .attr("x", output.X - output.Width + 10)
        .attr("y", output.Y + 12.5)
        .attr("font-size", 12)
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .attr("opacity", 0.8)
        .text(output.Name);
    });

    // Input value box
    if (node.InputValueWidth > 0) {
      group
        .append("rect")
        .attr("x", node.X + node.Width - node.InputValueWidth - 25)
        .attr("y", node.Y + 45)
        .attr("width", node.InputValueWidth)
        .attr("height", 25)
        .attr("fill", "rgba(60, 60, 60, 0.9)")
        .attr("stroke", "gray");

      group
        .append("text")
        .attr("x", node.X + node.Width - node.InputValueWidth - 20)
        .attr("y", node.Y + 45 + 12.5)
        .attr("font-size", 12)
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .text(node.InputValue);
    }
  });
}

export default ScriptViewCanvas;
