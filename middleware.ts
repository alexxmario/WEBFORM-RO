import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSubscriptionAccess } from "@/lib/subscription";
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookies) {
          cookies.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const redirect = (path: string) => {
    const result = NextResponse.redirect(new URL(path, request.url));
    response.cookies.getAll().forEach((cookie) => result.cookies.set(cookie));
    return result;
  };
  if (!user)
    return redirect(
      `/login?redirect=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`,
    );
  if (request.nextUrl.pathname.startsWith("/chat")) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role,subscription_status,subscription_expires_at")
      .eq("id", user.id)
      .single();
    if (error)
      return new NextResponse(
        "Serviciul nu este disponibil momentan. Încearcă din nou.",
        { status: 503 },
      );
    if (profile?.role !== "admin" && !hasSubscriptionAccess(profile))
      return redirect("/subscribe");
  }
  return response;
}
export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/chat/:path*", "/subscribe/:path*", "/start"],
};
