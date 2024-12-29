import Video from "next-video";
import introVideo from "@/videos/introvideo.mp4";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Charm } from "next/font/google";
import { PageBanner } from "../components/PageBanner";
import ResourceHighlights from "../components/ResourceHighlights";
import resourceCover from "@/public/resource-cover.png";

const charm = Charm({ weight: "700", subsets: ["latin"]});

export default function Resources() {
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
        <PageBanner imageSrc={resourceCover} title="Resources" description="Explore resources" />            
        <div className="container max-w-[1280px] mx-auto py-10 mt-10 mb-16 flex flex-col">
            <ResourceHighlights />
        </div>
    </section>   
        
    )
}