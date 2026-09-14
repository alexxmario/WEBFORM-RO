import { ApiError, requireUser } from "./api";
import { supabaseServerAdmin } from "./supabase/server";

export async function requireAdmin(request?: Request) {
  const user = await requireUser(request);
  const { data, error } = await supabaseServerAdmin().from("profiles").select("role").eq("id", user.id).single();
  if (error) throw error;
  if (data?.role !== "admin") throw new ApiError(403, "Acces rezervat administratorilor.");
  return user;
}
export const projectStatuses = ["new", "in_progress", "review", "published"] as const;
