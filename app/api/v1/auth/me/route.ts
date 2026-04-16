import { verifyClerkJwt } from "@/app/lib/auth/verifyClerkJwt";
import { User } from "@/app/lib/interface";
import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse } from "@/lib/api/responses";
import { getUserById } from "@/lib/supabase/db";

export async function GET(req: Request) {
    try {
        const userId = await verifyClerkJwt(req);

        if (!userId) {           
            throw new ApiError("INVALID_TOKEN", "Invalid token (no subject)", 401);
        }

        const user: User | null = await getUserById(userId);

        if (!user) {            
            throw new ApiError("USER_NOT_FOUND", "User not found", 404);
        }

        // return NextResponse.json({
        //     id: user.id,
        //     fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        //     email: user.email ?? "",
        //     avatarUrl: user.avatar_url,
        // });

        const data = {
            id: user.id,
            fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
            email: user.email ?? "",
            avatarUrl: user.avatar_url
        }

        return successResponse(data, 200);

    } catch (err: unknown) {
        return handleApiError(err);
    }    
}