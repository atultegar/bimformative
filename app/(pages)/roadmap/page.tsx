
import Roadmap from "@/app/components/Roadmap";
import { getRoadmapItems } from "@/lib/services/roadmap.service";

export default async function RoadmapPage() {
    const items = await getRoadmapItems();

    return <Roadmap items={items} />;
}