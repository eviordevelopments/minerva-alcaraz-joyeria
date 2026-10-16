import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrder } from "../../../../lib/orders/fulfillment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId } = paymentIntent.metadata || {};

        console.log(`[Stripe Webhook] Processing payment_intent.succeeded for PI: ${paymentIntent.id}, orderId: ${orderId}`);

        const result = await fulfillOrder({
          paymentIntentId: paymentIntent.id,
          orderId,
        });

        if (!result.success) {
          console.error(`[Stripe Webhook] fulfillOrder failed:`, result.error);
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        console.log(`[Stripe Webhook] Order ${result.orderId} fulfilled successfully`);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId } = paymentIntent.metadata || {};
        const errorMessage = paymentIntent.last_payment_error?.message || "El pago fue rechazado por el banco emisor";

        console.warn(`[Stripe Webhook] Payment failed for PI: ${paymentIntent.id}, orderId: ${orderId}: ${errorMessage}`);

        try {
          const { sendAnomalyAlert } = await import("../../../../lib/monitoring/alerts");
          await sendAnomalyAlert({
            type: "PAYMENT_FAILED",
            orderId,
            paymentIntentId: paymentIntent.id,
            error: errorMessage,
            details: {
              decline_code: paymentIntent.last_payment_error?.decline_code,
              code: paymentIntent.last_payment_error?.code,
            },
          });
        } catch (alertErr) {
          console.error("Failed to send anomaly alert on payment failure:", alertErr);
        }
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    try {
      const { sendAnomalyAlert } = await import("../../../../lib/monitoring/alerts");
      await sendAnomalyAlert({
        type: "WEBHOOK_ERROR",
        error: err?.message || "Fallo crítico en Stripe Webhook",
      });
    } catch (_) {}
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
