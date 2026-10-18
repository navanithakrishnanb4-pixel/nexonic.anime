import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session cookie on every matched request
 * and performs the coarse "/admin/* requires *some* authenticated
 * session" redirect. This is intentionally the ONLY thing middleware
 * does — it does not check the admin role. Role checking needs a
 * database read (public.profiles), and running that on every single
 * request in middleware (including static assets under /admin if the
 * matcher were broader) is unnecessary latency for a check that the
 * protected layout can do once, server-side, right where the dashboard
 * itself is rendered. Middleware here answers "is anyone logged in?";
 * app/admin/(protected)/layout.tsx answers "is this specific user an
 * admin?".
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // IMPORTANT: this call is what actually refreshes an expiring session
  // token and rewrites the cookie via the setters above. Do not remove
  // it thinking it's "just" a read — per Supabase's own SSR guidance,
  // skipping this is the most common cause of users being silently
  // logged out mid-session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
