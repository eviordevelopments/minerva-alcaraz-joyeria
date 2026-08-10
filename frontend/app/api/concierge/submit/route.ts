import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "../../../../lib/email/resend";
import { getConciergeConfirmationTemplate } from "../../../../lib/email/templates";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { contact_name, contact_email, description, user_id } = await req.json();

    if (!contact_name || !contact_email || !description) {
      return NextResponse.json(
        { error: "Nombre, email y descripción son requeridos." },
        { status: 400 }
      );
    }

    // Generate request number (e.g., MA-CON-8492)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const requestNumber = `MA-CON-${randomCode}`;

    // Insert into Supabase customization_requests
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("customization_requests")
      .insert({
        request_number: requestNumber,
        contact_name,
        contact_email,
        description,
        status: "pending_review",
        request_type: "co_creacion",
        user_id: user_id || null,
        communication_log: [
          {
            role: "system",
            message: "Solicitud registrada desde el formulario de Concierge en sitio web.",
            timestamp: new Date().toISOString(),
          },
        ],
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting customization request:", insertError);
      throw insertError;
    }

    // Prepare email HTML
    const emailHtml = getConciergeConfirmationTemplate({
      contactName: contact_name,
      contactEmail: contact_email,
      description,
      requestNumber,
    });

    // Send confirmation email to client
    await sendEmail({
      to: contact_email,
      subject: `Solicitud de Co-Creación Recibida · ${requestNumber}`,
      html: emailHtml,
    });

    // Send copy notification to Atelier
    await sendEmail({
      to: "concierge@minervaalcarazjoyeria.mx",
      subject: `[ATELIER] Nueva Solicitud Concierge · ${contact_name} (${requestNumber})`,
      html: emailHtml,
    }).catch((e) => console.log("Atelier copy notice:", e.message));

    return NextResponse.json({
      success: true,
      requestNumber,
      data: inserted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar la solicitud.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
