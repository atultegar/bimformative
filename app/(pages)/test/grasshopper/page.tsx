import GrasshopperCanvasD3 from "@/app/components/svg/GrasshopperCanvasD3";
import sampleData from "@/app/data/grasshopper-sample.json";

export default function GrasshopperTestPage() {
    const { Nodes, Connectors } = sampleData;

    return (
        <main className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">
                Grasshopper Canvas Test
            </h1>

            <div className="border rounded-lg overflow-hidden shadow">
                <GrasshopperCanvasD3
                    nodes={Nodes}
                    connectors={Connectors}
                    canvasWidth={1280}
                    canvasHeight={800} 
                />
            </div>
        </main>
    );
}