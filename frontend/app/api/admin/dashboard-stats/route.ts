import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Total products in catalog
    const { count: totalProducts } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // 2. Total registered users / profiles
    const { count: totalUsers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // 3. Circle members
    const { count: circleMembers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_circle_member", true);

    // 4. Newsletter subscribers
    const { count: newsletterSubs } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "subscribed");

    // 5. Recent activity: latest 8 profiles (joined recently)
    const { data: recentProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, created_at, is_circle_member, circle_tier")
      .order("created_at", { ascending: false })
      .limit(8);

    // 6. Concierge / customization requests
    const { count: openRequests } = await supabaseAdmin
      .from("customization_requests")
      .select("*", { count: "exact", head: true })
      .not("status", "eq", "delivered")
      .not("status", "eq", "cancelled");

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts ?? 0,
        totalUsers: totalUsers ?? 0,
        circleMembers: circleMembers ?? 0,
        newsletterSubs: newsletterSubs ?? 0,
        openRequests: openRequests ?? 0,
      },
      recentActivity: (recentProfiles ?? []).map((p) => ({
        id: p.id,
        user: p.full_name || p.email?.split("@")[0] || "Usuario",
        email: p.email,
        isCircle: p.is_circle_member ?? false,
        tier: p.circle_tier,
        joinedAt: p.created_at,
        action: p.is_circle_member
          ? "Se unió a The Circle"
          : "Se registró en el Atelier",
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
