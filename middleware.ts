import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ---- ROUTE MATCHERS ---- //
const isProtectedUIRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
]);

const isPublicApiRoute = (pathname: string) =>
  pathname.startsWith("/api/public") || 
  pathname === "/api/webhooks/clerk";

const isApiRoute = (pathname: string) =>
  pathname.startsWith("/api");

// ---- CLERK MIDDLEWARE ---- //
export default clerkMiddleware(async (auth, req: NextRequest ) => {
  const pathname = req.nextUrl.pathname;

  /* ----------- PUBLIC API (NO AUTH) -----------*/
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  /* ----------- DEV MASTER KEY -----------*/
  if (process.env.NODE_ENV === "development") {
    const devKey = req.headers.get("x-dev-key");
    if (devKey === process.env.DEV_MODE_MASTER_KEY) {
      return NextResponse.next();
    }
  }

  /* ----------- API ROUTES -----------*/
  if (isApiRoute(pathname)) {
        
    // 1. Server-to-server API key
    const apiKey = req.headers.get("x-api-key");
    if (apiKey === process.env.API_ALLOWED_KEY) {
      return NextResponse.next();
    }

    // 2. Desktop app JWT (Bearer token)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return NextResponse.next();
    }

    // 3. Web app Clerk session (cookie)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
        
    return NextResponse.next();
  }

  /* ----------- UI ROUTES -----------*/
  if (isProtectedUIRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

// ---- MATCH CONFIG ---- //
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};