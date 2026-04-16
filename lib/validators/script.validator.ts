import { z } from "zod";

export const PublishVersionSchema = z.object({
    storagePath: z.string().min(1),
    parsedJson: z.any().optional(),
    changeLog: z.string().optional(),
});