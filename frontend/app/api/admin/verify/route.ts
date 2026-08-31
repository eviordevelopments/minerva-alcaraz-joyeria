import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "minerva-fallback-secret-12345";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Token o contraseña faltante." }, { status: 400 });
    }

    // 1. Verify and decode token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, error: "El enlace de verificación es inválido o ha expirado." }, { status: 400 });
    }

    const { email, location, profiles } = decoded;

    // 2. Initialize Supabase Admin client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

    // 3. Create User auto-confirmed
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      // If user already exists, it might throw an error.
      throw new Error("No se pudo crear el usuario. " + authError.message);
    }

    if (!authData.user) {
      throw new Error("Error inesperado al crear el usuario.");
    }

    const userId = authData.user.id;

    // 4. Create ERP Account
    const { error: accountError } = await supabaseAdmin
      .from("erp_accounts")
      .insert({ id: userId, email, location });

    if (accountError) {
      // Cleanup if failed
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error("Error al crear la cuenta maestra: " + accountError.message);
    }

    // 5. Create Profiles
    for (const p of profiles) {
      const { error: profileError } = await supabaseAdmin
        .from("erp_profiles")
        .insert({
          account_id: userId,
          name: p.name,
          role: p.role,
          avatar_url: null
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }

    return NextResponse.json({ success: true, email: email });

  } catch (error: any) {
    console.error("Verify Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
