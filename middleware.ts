import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ---- ROUTE MATCHERS ---- //
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
]);

const isPublicApiRoute = (pathname: string) =>
  pathname.startsWith("/api/public") || 
  pathname === "/api/webhooks/clerk";

const isPrivateApiRoute = (pathname: string) =>
  pathname.startsWith("/api") && !isPublicApiRoute(pathname);

// ---- CLERK MIDDLEWARE ---- //
export default clerkMiddleware(async (auth, req ) => {
  const pathname = req.nextUrl.pathname;

  /* ----------- PUBLIC API -----------*/
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

  /* ----------- PRIVATE API -----------*/
  if (isPrivateApiRoute(pathname)) {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey === process.env.API_ALLOWED_KEY) {
      return NextResponse.next();
    }

    await auth.protect();
    return NextResponse.next();
  }

  /* ----------- UI ROUTES -----------*/
  if (isProtectedRoute(req)) {
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