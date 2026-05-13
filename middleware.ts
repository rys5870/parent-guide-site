import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

// טיפוס ל־publicMetadata
interface PublicMetadata {
  role?: string;
}

// נתיבים ציבוריים
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/courses',
  '/courses/(.*)',
  '/article(.*)',
  '/podcast',
  '/api/public(.*)',
  '/api/content(.*)',
  '/api/email(.*)',
  '/api/article(.*)',
  '/api/podcasts(.*)',
  '/api/about(.*)',
  '/api/testimonial(.*)',
  '/api/courses',
  '/api/courses/(.*)',
  '/api/categories(.*)',
  '/api/submit-drawing(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/drawing(.*)',
]);

// נתיבים מנהליים
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
]);

// פונקציה שמחזירה סוג נתיב
function getRouteType(req: NextRequest): 'public' | 'admin' | 'private' {
  if (isPublicRoute(req)) return 'public';
  if (isAdminRoute(req)) return 'admin';
  return 'private';
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const routeType = getRouteType(req);

  // גישה ציבורית
  if (routeType === 'public') {
    return NextResponse.next();
  }

  // אין משתמש מחובר
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // בדיקת הרשאות מנהל
  if (routeType === 'admin') {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = (user.publicMetadata as PublicMetadata)?.role;

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // ברירת מחדל — גישה מותרת
  return NextResponse.next();
});

// קונפיגורציה ל־matcher
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
