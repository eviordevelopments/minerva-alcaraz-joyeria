import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Auth Callback Route
 * Handles email confirmation, OAuth, and magic links
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/perfil";

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth?error=callback_failed`);
}
