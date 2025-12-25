import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ---- ROUTE MATCHERS ---- //
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
]);

const isPublicApiRoute = (pathname: string) =>
  pathname.startsWith("/api/public");

const isPrivateApiRoute = (pathname: string) =>
  pathname.startsWith("/api") && !pathname.startsWith("/api/public");

// ---- MAIN MIDDLEWARE ---- //
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // PUBLIC API → NO AUTH
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // DEV MASTER KEY (DEV ONLY)
  if (process.env.NODE_ENV === "development") {
    const devKey = req.headers.get("x-dev-key");

    if (devKey && devKey === process.env.DEV_MODE_MASTER_KEY) {      
      return NextResponse.next();
    }
  }

  // PRIVATE API SECURITY - Either CLerk or API Key
  if (isPrivateApiRoute(pathname)) {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey && apiKey === process.env.API_ALLOWED_KEY) {
      return NextResponse.next;
    }

    // Otherwise Clerk must handle it
    // Let clerkMiddleware run
    return NextResponse.next();
  }  

  // UI Routes fall through to Clerk
  return NextResponse.next();
}



// ---- CLERK MIDDLEWARE WRAPPER ---- //
export default clerkMiddleware(async (auth, req ) => {
  const pathname = req.nextUrl.pathname;

  // Protect UI routes (NOT API routes)
  if(isProtectedRoute(req)) {
    await auth.protect();
    return;
  }

  // Protect private APIs if no API key was provided
  if (isPrivateApiRoute(pathname)) {
    const apiKey = req.headers.get("x-api-key");
    if(!apiKey) {
      await auth.protect();
    }
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