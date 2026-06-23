import { ScriptVisibility } from "@/lib/shared/constants/visibility";

export interface PublishVisualScriptInput {
    userId: string;
    organizationId?: string;
    visibility: ScriptVisibility;
    title?: string;
    description?: string;
    tags?: string[];
    file: File;
    parsedGraph: any;
    demoLink?: string;
    hostApplication?: string;
}