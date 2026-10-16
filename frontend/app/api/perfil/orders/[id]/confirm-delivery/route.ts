import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rating, feedback, aspects } = await req.json();

    // 1. Fetch current order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*, profiles(full_name, email)")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // 2. Update order to delivered if not already delivered
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "delivered",
        delivered_at: order.delivered_at || now,
        updated_at: now,
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 3. Save review / survey feedback if provided
    if (rating) {
      // Find order items for product references
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("id, product_id, product_name")
        .eq("order_id", id);

      if (items && items.length > 0 && order.user_id) {
        for (const item of items) {
          if (item.product_id) {
            try {
              await supabaseAdmin.from("product_reviews").upsert({
                product_id: item.product_id,
                user_id: order.user_id,
                order_item_id: item.id,
                rating: Number(rating),
                title: aspects?.join(" · ") || "Experiencia de Compra Minerva Alcaraz",
                body: feedback || "Entrega confirmada y calificada por el cliente.",
                is_verified_purchase: true,
                is_approved: true,
              }, { onConflict: "user_id,product_id,order_item_id" });
            } catch (revErr) {
              console.warn("Could not upsert into product_reviews:", revErr);
            }
          }
        }
      }

      // Notify Atelier & Development team of customer satisfaction survey
      try {
        const starsText = "⭐".repeat(Math.min(5, Math.max(1, Number(rating))));
        const customerName = order.shipping_name || order.profiles?.full_name || "Cliente Distinguido";
        
        await sendEmail({
          to: ["minerva.alcaraz.joyeria@gmail.com", "eviordevelopments@gmail.com"],
          subject: `✨ Encuesta de Satisfacción · ${starsText} · Orden ${order.order_number}`,
          html: `
            <div style="font-family: serif; color: #2C3729; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #CBB67B; background: #FAF7F5;">
              <h2 style="color: #2C3729; margin-top: 0;">Entrega Confirmada y Calificada por Cliente</h2>
              <p>El cliente <strong>${customerName}</strong> ha confirmado la recepción física de su joya y completó la encuesta de servicio:</p>
              
              <div style="background: white; border: 1px solid rgba(203,182,123,0.3); padding: 18px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 18px; color: #CBB67B;"><strong>Calificación:</strong> ${starsText} (${rating}/5)</p>
                ${aspects && aspects.length > 0 ? `<p style="margin: 0 0 10px 0; font-size: 13px;"><strong>Aspectos destacados:</strong> ${aspects.join(", ")}</p>` : ""}
                ${feedback ? `<p style="margin: 0; font-size: 13px; font-style: italic;">&ldquo;${feedback}&rdquo;</p>` : ""}
              </div>

              <p style="font-size: 12px; color: #8E9A8B;">
                Orden: <strong>${order.order_number}</strong> | Fecha: ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}
              </p>
            </div>
          `,
        });
      } catch (notifyErr) {
        console.error("Error sending survey email notification:", notifyErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Entrega confirmada y encuesta registrada con éxito",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
