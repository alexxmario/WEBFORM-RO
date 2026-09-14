import { NextResponse } from "next/server";
// Uploads now retain stable private paths; no copy/delete operation is required.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Fișierele sunt asociate automat la trimiterea proiectului.",
    },
    { status: 410 },
  );
}
