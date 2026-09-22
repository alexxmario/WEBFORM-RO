import { supabaseServerAdmin } from "./supabase/server";

export const PROJECT_WELCOME_MESSAGE = `Bine ai venit în chat-ul proiectului WebForm! Am primit formularul tău.

Ce urmează:
1. Analizăm informațiile. Vă vom contacta curând.
2. Clarificăm în acest chat textele, imaginile și orice detaliu lipsă.
3. Îți trimitem aici prima versiune a site-ului pentru verificare.
4. După aprobarea ta, publicăm site-ul și rămânem aici pentru actualizări.

De acum înainte, aceasta este conversația principală a proiectului. Poți scrie oricând o întrebare sau poți trimite o modificare.`;

export async function ensureProjectChatWelcome(
  userId: string,
  userEmail: string,
) {
  const db = supabaseServerAdmin();
  const { data: roomId, error: roomError } = await db.rpc(
    "webform_init_room",
    { p_user_id: userId, p_email: userEmail },
  );
  if (roomError || !roomId) throw roomError || new Error("Room unavailable");

  const { data: existing, error: existingError } = await db
    .from("messages")
    .select("id")
    .eq("room_id", roomId)
    .eq("content", PROJECT_WELCOME_MESSAGE)
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return { roomId, created: false };

  const { data: admin, error: adminError } = await db
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (adminError || !admin)
    throw adminError || new Error("No WebForm administrator configured");

  const { error: messageError } = await db.from("messages").insert({
    room_id: roomId,
    sender_id: admin.id,
    content: PROJECT_WELCOME_MESSAGE,
  });
  if (messageError) throw messageError;
  return { roomId, created: true };
}
