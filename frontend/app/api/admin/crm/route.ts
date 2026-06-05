import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. All profiles with their circle membership status
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select(
        `id, full_name, email, avatar_url, phone, is_circle_member,
         circle_tier, total_purchases, total_spent_cents, 
         circle_joined_at, created_at, updated_at`
      )
      .order("created_at", { ascending: false });

    if (profilesError) throw profilesError;

    // 2. Newsletter subscribers (may not have a profile)
    const { data: newsletters, error: newsletterError } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .select("id, email, first_name, last_name, status, subscribed_at, source")
      .eq("status", "subscribed")
      .order("subscribed_at", { ascending: false });

    if (newsletterError) throw newsletterError;

    // Build a unified contact list
    // Profile emails take precedence; newsletter-only contacts fill the rest
    const profileEmails = new Set((profiles ?? []).map((p) => p.email));

    const newsletterOnly = (newsletters ?? []).filter(
      (n) => !profileEmails.has(n.email)
    );

    const contacts = [
      ...(profiles ?? []).map((p) => ({
        id: p.id,
        name: p.full_name || p.email?.split("@")[0] || "Sin nombre",
        email: p.email ?? "",
        membership: p.is_circle_member ? "The Circle" : "Registrado",
        tier: p.circle_tier ?? null,
        purchasesCount: p.total_purchases ?? 0,
        totalSpentCents: p.total_spent_cents ?? 0,
        joinDate: p.created_at,
        lastUpdated: p.updated_at,
        source: "profile",
        isCircle: p.is_circle_member ?? false,
      })),
      ...newsletterOnly.map((n) => ({
        id: n.id,
        name:
          n.first_name && n.last_name
            ? `${n.first_name} ${n.last_name}`
            : n.email.split("@")[0],
        email: n.email,
        membership: "Newsletter",
        tier: null,
        purchasesCount: 0,
        totalSpentCents: 0,
        joinDate: n.subscribed_at,
        lastUpdated: n.subscribed_at,
        source: "newsletter",
        isCircle: false,
      })),
    ];

    return NextResponse.json({ contacts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
