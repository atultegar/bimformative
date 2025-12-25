import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RoadmapItem } from "@/lib/types/resources"
import ProgressBar from "./ProgressBar";

type Props = {
    items: RoadmapItem[];
}

export default function RoadmapList({ items }: Props) {
    return (
        <div className="mb-16 p-5 rounded-md bg-muted">
            <ul className="space-y-5">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center justify-between rounded-lg px-4 py-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="text-left">
                                    {item.title}
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[500px]">
                                    <p>{item.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>                                        
                        <ProgressBar 
                            className="w-[250px]" 
                            statusValue={item.status} 
                        />                                  
                    </li>
                ))}
            </ul>            
        </div>
    );
}