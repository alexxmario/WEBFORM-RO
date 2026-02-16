import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // Get the access token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Trebuie sa fii autentificat" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    // Create Supabase client with the access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    // Get user from the token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Trebuie sa fii autentificat" },
        { status: 401 }
      );
    }

    // Use service role to update the subscription status
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update subscription status to cancelled
    // The subscription remains active until the expiry date
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "cancelled",
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error cancelling subscription:", updateError);
      return NextResponse.json(
        { error: "Eroare la anularea abonamentului" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Abonamentul a fost anulat. Va ramane activ pana la data expirarii.",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Eroare la anularea abonamentului" },
      { status: 500 }
    );
  }
}
