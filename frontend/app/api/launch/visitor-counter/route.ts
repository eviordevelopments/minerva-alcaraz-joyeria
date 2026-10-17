import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { visitorId, existingNumber } = body;

    // 1. Si el visitante ya tiene un número asignado registrado en su dispositivo,
    // se lo confirmamos sin inflar el contador global.
    if (existingNumber && typeof existingNumber === "number" && existingNumber > 0) {
      const { data } = await supabaseAdmin
        .from("site_content")
        .select("content")
        .eq("page", "launch")
        .eq("section", "counter")
        .single();

      const total = data?.content?.total_visitors || existingNumber;
      return NextResponse.json({
        visitorNumber: existingNumber,
        totalVisitors: total,
        isNew: false,
      });
    }

    // 2. Obtener el contador actual de Supabase
    const { data: record } = await supabaseAdmin
      .from("site_content")
      .select("id, content")
      .eq("page", "launch")
      .eq("section", "counter")
      .single();

    let currentTotal = 0;
    if (record?.content?.total_visitors !== undefined && record?.content?.total_visitors !== null) {
      currentTotal = Number(record.content.total_visitors);
    }

    const newVisitorNumber = currentTotal + 1;

    // 3. Actualizar de forma atómica en site_content
    await supabaseAdmin
      .from("site_content")
      .upsert(
        {
          page: "launch",
          section: "counter",
          content: {
            launch_date: "2026-10-16T17:00:00-06:00",
            total_visitors: newVisitorNumber,
            last_visitor_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page,section" }
      );

    return NextResponse.json({
      visitorNumber: newVisitorNumber,
      totalVisitors: newVisitorNumber,
      isNew: true,
    });
  } catch (err: any) {
    console.error("Error en /api/launch/visitor-counter:", err);
    // Fallback de resiliencia: no bloquear la experiencia del usuario
    return NextResponse.json({
      visitorNumber: 1,
      totalVisitors: 1,
      isNew: true,
    });
  }
}

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("site_content")
      .select("content")
      .eq("page", "launch")
      .eq("section", "counter")
      .single();

    const total = data?.content?.total_visitors || 1;
    return NextResponse.json({ totalVisitors: total });
  } catch {
    return NextResponse.json({ totalVisitors: 1 });
  }
}
