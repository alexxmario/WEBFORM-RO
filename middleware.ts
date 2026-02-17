import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected route: /subscribe requires auth
  if (pathname === "/subscribe") {
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protected route: /start (Blueprint form) requires auth + subscription
  if (pathname === "/start") {
    // Not logged in - redirect to login
    if (!user) {
      console.log("[Middleware] /start - No user session found, redirecting to login");
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check subscription status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_status, subscription_expires_at")
      .eq("id", user.id)
      .single();

    console.log("[Middleware] /start - User:", user.id, "Status:", profile?.subscription_status, "Error:", profileError?.message);

    // Allow access if subscription is active OR cancelled but not expired
    const hasAccess =
      profile?.subscription_status === "active" ||
      (profile?.subscription_status === "cancelled" &&
        profile?.subscription_expires_at &&
        new Date(profile.subscription_expires_at) > new Date());

    if (!hasAccess) {
      console.log("[Middleware] /start - No access, redirecting to subscribe");
      return NextResponse.redirect(new URL("/subscribe", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, html templates, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|html|css|js|json|xml|txt|woff|woff2|ttf|eot)$).*)",
  ],
};
