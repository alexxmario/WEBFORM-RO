import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
export async function getServerUser(request?: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
  const authorization = request?.headers.get("authorization");
  if (authorization) {
    if (!/^Bearer \S+$/.test(authorization)) return null;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const {
      data: { user },
      error,
    } = await client.auth.getUser(authorization.slice(7));
    if (error) return null;
    return user;
  }
  const cookieStore = await cookies();
  const client = createServerClient(url, key, {
    cookies: { getAll: () => cookieStore.getAll() },
  });
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}
