import { parseWithZod } from "@conform-to/zod";
import { scriptFormSchema } from "../lib/zodSchemas";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function AddScript(formData: FormData) {
    const submission = parseWithZod(formData,  {
        schema: scriptFormSchema,
    });

    if(submission.status !== "success") {
        return submission.reply();
    }

    const title = formData.get("title");
    console.log(title);
    
}

export async function validateAddScript(values: z.infer<typeof scriptFormSchema>) {
    const result = scriptFormSchema.safeParse(values);

    if (!result.success) {
        return {
            status: "error",
            message: result.error.message,
        };
    }

    console.log(result.data.title);

    return {
        status: "success",
        message: "Script added successfully"
    }
}