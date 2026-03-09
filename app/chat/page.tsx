import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { ChatClient } from "./chat-client";

export default async function ChatPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect("/login?redirect=/chat");
  }

  // Fetch profile with role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  const initialUser = {
    id: user.id,
    email: user.email || "",
    role: profile?.role || "client",
  };

  return <ChatClient initialUser={initialUser} />;
}
