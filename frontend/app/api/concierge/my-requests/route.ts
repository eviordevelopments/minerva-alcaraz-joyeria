import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!userId && !email) {
      return NextResponse.json({ requests: [] });
    }

    let query = supabaseAdmin
      .from("customization_requests")
      .select(`
        id,
        request_number,
        contact_name,
        contact_email,
        contact_phone,
        status,
        request_type,
        description,
        desired_material,
        desired_stone,
        desired_size,
        engraving_text,
        occasion,
        budget_cents,
        timeline_weeks,
        minerva_notes,
        quoted_price_cents,
        estimated_ready_at,
        communication_log,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    if (userId && email) {
      query = query.or(`user_id.eq.${userId},contact_email.ilike.${email}`);
    } else if (userId) {
      query = query.eq("user_id", userId);
    } else if (email) {
      query = query.ilike("contact_email", email);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching user customization requests:", error);
      throw error;
    }

    return NextResponse.json({ requests: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener solicitudes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
