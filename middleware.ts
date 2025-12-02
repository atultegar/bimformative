import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ---- MAIN MIDDLEWARE ---- //
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ============================================
  // 1. DEV MODE MASTER KEY → BYPASS EVERYTHING
  // ============================================
  if (process.env.NODE_ENV === "development") {
    const devKey = req.headers.get("x-dev-key");

    if (devKey && devKey === process.env.DEV_MODE_MASTER_KEY) {
      // Skip all other checks -> For Postman dev testing
      return NextResponse.next();
    }
  }

  // ==============================
  // 2. GLOBAL API LAYER SECURITY
  // ==============================
  if (pathname.startsWith("/api")) {
    const apiKey = req.headers.get("x-api-key") || req.nextUrl.searchParams.get("key");

    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_ALLOWED_KEY) {
      return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    return NextResponse.next();
  }

  // UI Routes → allow Clerk wrapper to execute below
  return NextResponse.next();

}

// ---- PROTECTED UI ROUTES (Clerk Required) ---- //
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
])

// ---- CLERK MIDDLEWARE WRAPPER ---- //
export default clerkMiddleware(async (auth, req ) => {
  // Protect UI routes (NOT API routes)
  if(isProtectedRoute(req)) {
    await auth.protect();
  } 
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