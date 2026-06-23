import { handleApiError, successResponse } from "@/lib/api/responses";
import { getTools } from "@/lib/services/tools.service"

export async function GET(req: Request) {
    try {
        const result = await getTools();
        
        return successResponse(result, 200)
    } catch (err: unknown) {
        return handleApiError(err) 
    }
}