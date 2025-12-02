import { z } from "zod";

export const scriptFormSchema = z.object({
    scriptFile: z.array(z.instanceof(File)).min(1),
    title: z.string().min(3).max(50),
    scripttype: z.string(),
    description: z.string().min(3),
    youtubevideo: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    shareagree: z.boolean().optional(),    
    });