import { NextResponse } from "next/server";
import { supabaseServerAdmin } from "@/lib/supabase/server";

type SignupRequest = {
  email: string;
  password: string;
  name?: string;
  businessName?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupRequest;

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = supabaseServerAdmin();

    // Create user with admin client (bypasses email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      return NextResponse.json(
        { error: `Signup failed: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create the profile
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const isAdmin = adminEmails.includes(body.email.toLowerCase());

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: body.email,
        name: body.name,
        business_name: body.businessName,
        phone_number: body.phone,
        role: isAdmin ? "admin" : "client",
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail the signup if profile creation fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}