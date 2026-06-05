import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Ensure seed recursos exist
async function ensureRecursos() {
  const { data } = await supabaseAdmin
    .from("recursos_showroom")
    .select("id, nombre_recurso")
    .eq("activo", true);

  if (!data || data.length === 0) {
    await supabaseAdmin.from("recursos_showroom").insert([
      { nombre_recurso: "Mesa Principal de Diamantes", activo: true },
      { nombre_recurso: "Cubículo Privado de Atención", activo: true },
    ]);
  }
}

// GET — list all recursos and today's citas
export async function GET() {
  try {
    await ensureRecursos();

    const { data: recursos, error: recursosError } = await supabaseAdmin
      .from("recursos_showroom")
      .select("id, nombre_recurso")
      .eq("activo", true)
      .order("nombre_recurso");

    if (recursosError) throw recursosError;

    // Get today's appointments (using TSTZRANGE, query by overlap with today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: citas, error: citasError } = await supabaseAdmin
      .from("citas_showroom")
      .select(
        `id, recurso_id, duracion_cita, motivo_visita, estatus_cita, 
         notas_asesor, created_at,
         recursos_showroom ( nombre_recurso )`
      )
      .not("estatus_cita", "eq", "Cancelada")
      .order("created_at", { ascending: true });

    if (citasError) throw citasError;

    return NextResponse.json({
      recursos: recursos ?? [],
      citas: (citas ?? []).map((c) => {
        // Parse TSTZRANGE "[start,end)" format
        const rangeMatch = c.duracion_cita?.match(
          /\["?([^",]+)"?,\s*"?([^",\)]+)"?\)/
        );
        return {
          id: c.id,
          recursoId: c.recurso_id,
          recursoNombre:
            (c.recursos_showroom as unknown as { nombre_recurso: string } | null)
              ?.nombre_recurso ?? "",
          horaInicio: rangeMatch?.[1]
            ? new Date(rangeMatch[1]).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "—",
          horaFin: rangeMatch?.[2]
            ? new Date(rangeMatch[2]).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "—",
          rawStart: rangeMatch?.[1] ?? null,
          rawEnd: rangeMatch?.[2] ?? null,
          motivo: c.motivo_visita,
          status: c.estatus_cita,
        };
      }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — create a new showroom appointment
export async function POST(req: NextRequest) {
  try {
    const { recursoId, cliente, horaInicio, horaFin, motivo, fecha } =
      await req.json();

    if (!recursoId || !cliente || !horaInicio || !horaFin || !motivo) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Build the date + the provided times for the tstzrange
    const dateStr = fecha || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const start = `${dateStr}T${horaInicio}:00-06:00`; // Mexico City offset
    const end = `${dateStr}T${horaFin}:00-06:00`;
    const tstzrange = `["${start}","${end}")`;

    const { data, error } = await supabaseAdmin
      .from("citas_showroom")
      .insert({
        recurso_id: recursoId,
        duracion_cita: tstzrange,
        motivo_visita: motivo,
        estatus_cita: "Confirmada",
        notas_asesor: `Cliente: ${cliente}`,
      })
      .select()
      .single();

    if (error) {
      // PostgreSQL exclusion constraint violation → overlap error
      if (error.code === "23P01") {
        return NextResponse.json(
          {
            error:
              "ExclusionViolation [23P01]: El recurso ya está reservado en ese rango horario.",
            isOverlap: true,
          },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, cita: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — cancel an appointment
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabaseAdmin
      .from("citas_showroom")
      .update({ estatus_cita: "Cancelada" })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
