import React from "react";
import SVGCanvas from "../components/svg/SVGCanvas";
import { client, urlFor } from "../lib/sanity";
import { Node } from "../lib/interface";
import SVGCanvasD3 from "../components/svg/SvgCanvasD3";

async function getData() {
    const query = `*[_type == 'dynamoscript' && title == 'Update Anchor Inclination'] | order(_createdAt desc) {
  title,
    "code": scriptView.code
  }`;

  const data = await client.fetch(query);

  return data;
}

interface scriptData {
  title: string;
  code: string;
}

export default async function Canvas() {
    const data: scriptData = await getData();
    const code = JSON.parse(data[0].code);

    const nodes = code.Nodes;
    const connectors = code.Connectors;
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">            
            <div className="container max-w-[1280px] mx-auto py-10 mt-10 mb-16 flex flex-col">
                <h1 className="text-4xl font-bold text-center mb-10">Dynamo Script</h1>
                <SVGCanvasD3 nodes={nodes} connectors={connectors} canvasWidth={1200} canvasHeight={675} />
            </div>
        </section>           
    )
}