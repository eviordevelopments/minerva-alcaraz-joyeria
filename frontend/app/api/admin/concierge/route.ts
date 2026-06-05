import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — list all concierge/customization requests
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("customization_requests")
      .select(
        `id, request_number, contact_name, contact_email, contact_phone,
         status, request_type, description, desired_material, desired_stone,
         desired_size, engraving_text, occasion, budget_cents,
         timeline_weeks, minerva_notes, quoted_price_cents,
         estimated_ready_at, communication_log, created_at, updated_at`
      )
      .not("status", "in", '("delivered","cancelled")')
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — update status or add a note to a concierge request
export async function PATCH(req: NextRequest) {
  try {
    const { id, status, minerva_notes, newLogEntry } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // Build the update payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (minerva_notes !== undefined) updates.minerva_notes = minerva_notes;

    // Append to communication_log if a new entry is provided
    if (newLogEntry) {
      // Fetch current log
      const { data: current } = await supabaseAdmin
        .from("customization_requests")
        .select("communication_log")
        .eq("id", id)
        .single();

      const existingLog = current?.communication_log ?? [];
      updates.communication_log = [
        ...existingLog,
        {
          role: "admin",
          message: newLogEntry,
          timestamp: new Date().toISOString(),
        },
      ];
    }

    const { data, error } = await supabaseAdmin
      .from("customization_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
