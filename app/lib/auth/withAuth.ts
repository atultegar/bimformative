import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const DEV_BYPASS = process.env.NODE_ENV === "development";
const LOCAL_API_KEY = process.env.NEXT_PUBLIC_API_ALLOWED_KEY;
const DEV_USER_ID = process.env.DEV_FAKE_USER_ID;

export type WithAuthContext = {
  req: Request; 
  userId: any;
  params?: Record<string, string>;
};

export function withAuth(handler: (ctx: WithAuthContext) => Promise<Response>
) {
    
    return async (req: Request, context: any) => {
        const resolvedParams = 
        typeof context?.params?.then === "function"
        ? await context.params
        : context?.params;
        
        // 1. Development bypass
        if (DEV_BYPASS) {
            return handler({ req, userId: DEV_USER_ID, params: context?.params });
        }

        // 2. API Key check
        const key = req.headers.get("x-api-key");

        if (!key || key !== LOCAL_API_KEY) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid API Key" },
                { status: 401 }
            );
        }

        // 3. Clerk Authentication (must be inside a route)
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized - User not signed in" },
                { status: 401 }
            );
        }

        // 4. Pass userId + request to your handler
        return handler({ req, userId, params: context?.params });
    }
}