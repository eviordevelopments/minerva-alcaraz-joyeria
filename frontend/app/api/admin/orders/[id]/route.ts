import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendEmail } from "../../../../../lib/email/resend";
import { getOrderDeliveredTemplate } from "../../../../../lib/email/templates";
import { fulfillOrder } from "../../../../../lib/orders/fulfillment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch order details + profiles
    let { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .eq("id", id)
      .single();

    if (orderError) throw orderError;

    // 2. Fetch order items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    // 3. Real-Time Stripe Payment Telemetry & Auto-Healing
    let stripeTelemetry: any = null;

    if (order?.payment_reference && order.payment_reference.startsWith("pi_")) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          order.payment_reference,
          { expand: ["latest_charge"] }
        );

        const charge = paymentIntent.latest_charge as Stripe.Charge | null;

        // AUTO-HEALING: If Stripe confirms payment succeeded but order is stuck in "pending", fulfill it automatically!
        if (order.status === "pending" && paymentIntent.status === "succeeded") {
          console.log(`[Admin Order ${id}] Auto-healing pending order verified as succeeded in Stripe`);
          await fulfillOrder({
            orderId: order.id,
            paymentIntentId: paymentIntent.id,
          });

          // Refresh order from DB
          const { data: refreshedOrder } = await supabaseAdmin
            .from("orders")
            .select(`*, profiles(full_name, email, phone)`)
            .eq("id", id)
            .single();

          if (refreshedOrder) order = refreshedOrder;
        }

        const cardDetails = charge?.payment_method_details?.card;

        stripeTelemetry = {
          payment_intent_id: paymentIntent.id,
          charge_id: charge?.id || "N/A",
          amount_mxn: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          stripe_status: paymentIntent.status,
          paid: charge?.paid ?? (paymentIntent.status === "succeeded"),
          captured: charge?.captured ?? (paymentIntent.status === "succeeded"),
          card_brand: cardDetails?.brand ? cardDetails.brand.toUpperCase() : "Tarjeta",
          card_last4: cardDetails?.last4 || "----",
          seller_message: charge?.outcome?.seller_message || "Payment complete.",
          risk_level: charge?.outcome?.risk_level || "normal",
          risk_score: charge?.outcome?.risk_score ?? "Bajo",
          charge_created: charge?.created
            ? new Date(charge.created * 1000).toLocaleString("es-MX", { timeZone: "America/Mexico_City" })
            : null,
          receipt_url: charge?.receipt_url || null,
          receipt_number: charge?.receipt_number || null,
          is_settled: paymentIntent.status === "succeeded",
        };
      } catch (stripeErr: any) {
        console.warn(`[Admin Order ${id}] Error fetching Stripe telemetry:`, stripeErr?.message);
        stripeTelemetry = {
          error: "No se pudo consultar telemetría en tiempo real con Stripe",
          details: stripeErr?.message,
        };
      }
    }

    return NextResponse.json({ order, items, stripeTelemetry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, tracking_number } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    
    // Automatically set delivered/shipped timestamps if applicable
    if (status === "shipped") updates.updated_at = new Date().toISOString();
    if (status === "delivered") {
      updates.delivered_at = new Date().toISOString();
      updates.updated_at = new Date().toISOString();
    }

    // Check current status
    const { data: currentOrder } = await supabaseAdmin
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    const { data: updatedOrder, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If transitioned to delivered, send email
    if (currentOrder && currentOrder.status !== "delivered" && status === "delivered") {
      const customerName = updatedOrder.shipping_name || "Cliente";
      const customerEmail = updatedOrder.shipping_email;
      
      if (customerEmail) {
        try {
          const deliveredTemplate = getOrderDeliveredTemplate({
            customerName,
            orderId: id
          });
          
          await sendEmail({
            to: customerEmail,
            subject: `📦 Tu Pedido de Minerva Alcaraz ha sido entregado ✨`,
            html: deliveredTemplate,
          });
          console.log(`Delivered email sent for order ${id}`);
        } catch (emailErr) {
          console.error("Error sending delivered email:", emailErr);
        }
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
