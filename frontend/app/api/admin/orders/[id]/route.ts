import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendEmail } from "../../../../../lib/email/resend";
import { getOrderDeliveredTemplate, getOrderTrackingNotificationTemplate } from "../../../../../lib/email/templates";
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
    const { status, tracking_number, carrier, send_notification } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (tracking_number !== undefined) {
      const cleanTrack = tracking_number ? tracking_number.trim() : null;
      updates.tracking_number = cleanTrack;
      // Default carrier to DHL Express if not specified or empty
      if (cleanTrack && (!carrier || !carrier.trim())) {
        updates.carrier = "DHL Express";
      }
    }
    if (carrier !== undefined && carrier) {
      updates.carrier = carrier.trim();
    }
    updates.updated_at = new Date().toISOString();

    // Automatically transition to 'shipped' if tracking number is provided and status is paid or processing
    if (updates.tracking_number && (!status || status === "paid" || status === "processing")) {
      updates.status = "shipped";
    }

    if (updates.status === "shipped") updates.updated_at = new Date().toISOString();
    if (updates.status === "delivered" || status === "delivered") {
      updates.delivered_at = new Date().toISOString();
      updates.updated_at = new Date().toISOString();
    }

    // 1. Check current status, tracking, and customer info
    const { data: currentOrder } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        tracking_number,
        carrier,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_street,
        shipping_exterior_num,
        shipping_interior_num,
        shipping_colonia,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        profiles (
          full_name,
          email,
          phone
        ),
        order_items (
          id,
          product_name,
          product_sku,
          product_image,
          quantity,
          unit_price_cents,
          subtotal_cents
        )
      `)
      .eq("id", id)
      .single();

    // 2. Update order in database
    const { data: updatedOrder, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        profiles (
          full_name,
          email,
          phone
        ),
        order_items (
          id,
          product_name,
          product_sku,
          product_image,
          quantity,
          unit_price_cents,
          subtotal_cents
        )
      `)
      .single();

    if (error) throw error;

    let trackingEmailSent = false;
    let deliveredEmailSent = false;

    const customerEmail = updatedOrder.shipping_email || updatedOrder.profiles?.email;
    const customerName = updatedOrder.shipping_name || updatedOrder.profiles?.full_name || "Cliente Distinguido(a)";

    // 3. Send tracking email notification if tracking number is set/updated
    const trackingChanged = updates.tracking_number !== undefined && updates.tracking_number !== (currentOrder?.tracking_number || null);
    const statusTransitionedToShipped = (updates.status === "shipped" || status === "shipped") && currentOrder?.status !== "shipped";
    const hasTracking = Boolean(updatedOrder.tracking_number);

    if (hasTracking && (trackingChanged || statusTransitionedToShipped || send_notification === true)) {
      if (customerEmail) {
        try {
          const items = (updatedOrder.order_items || []).map((it: any) => ({
            name: it.product_name,
            price: (it.unit_price_cents || it.subtotal_cents || 0) / 100,
            quantity: it.quantity || 1,
            image: it.product_image || undefined,
            sku: it.product_sku || undefined,
          }));

          const addressParts = [
            updatedOrder.shipping_street,
            updatedOrder.shipping_exterior_num,
            updatedOrder.shipping_interior_num ? `Int. ${updatedOrder.shipping_interior_num}` : "",
            updatedOrder.shipping_colonia ? `Col. ${updatedOrder.shipping_colonia}` : "",
            updatedOrder.shipping_city,
            updatedOrder.shipping_state,
            updatedOrder.shipping_postal_code ? `C.P. ${updatedOrder.shipping_postal_code}` : "",
            updatedOrder.shipping_country || "México",
          ].filter(Boolean).join(", ");

          const trackingTemplate = getOrderTrackingNotificationTemplate({
            customerName,
            orderNumber: updatedOrder.order_number || `ORD-${id.slice(0, 8)}`,
            trackingNumber: updatedOrder.tracking_number,
            carrier: updatedOrder.carrier || carrier || "DHL Express",
            items,
            shippingAddress: addressParts,
          });

          await sendEmail({
            to: customerEmail,
            subject: `💎 Tu Joya Minerva Alcaraz Está en Camino · Guía ${updatedOrder.tracking_number} 📦`,
            html: trackingTemplate,
          });
          trackingEmailSent = true;
          console.log(`[Order ${id}] Tracking email sent to ${customerEmail} (Guía: ${updatedOrder.tracking_number})`);
        } catch (emailErr) {
          console.error(`[Order ${id}] Error sending tracking email:`, emailErr);
        }
      } else {
        console.warn(`[Order ${id}] No customer email found to send tracking notification.`);
      }
    }

    // 4. If transitioned to delivered, send delivered email
    if (currentOrder && currentOrder.status !== "delivered" && status === "delivered") {
      if (customerEmail) {
        try {
          const deliveredTemplate = getOrderDeliveredTemplate({
            customerName,
            orderId: updatedOrder.order_number || id,
          });

          await sendEmail({
            to: customerEmail,
            subject: `📦 Tu Pedido de Minerva Alcaraz ha sido entregado ✨`,
            html: deliveredTemplate,
          });
          deliveredEmailSent = true;
          console.log(`[Order ${id}] Delivered email sent to ${customerEmail}`);
        } catch (emailErr) {
          console.error(`[Order ${id}] Error sending delivered email:`, emailErr);
        }
      }
    }

    return NextResponse.json({
      order: updatedOrder,
      trackingEmailSent,
      deliveredEmailSent,
      customerEmail,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
