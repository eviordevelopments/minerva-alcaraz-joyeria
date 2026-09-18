import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "../../../../lib/email/resend";
import { getPurchaseConfirmationTemplate, getAdminPurchaseNotificationTemplate } from "../../../../lib/email/templates";

// Webhook secret will be checked at runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

        if (!orderId) {
          console.error("No orderId found in PaymentIntent metadata");
          break;
        }

        // Update the order status to "paid"
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            payment_confirmed_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (updateError) {
          console.error(`Failed to update order ${orderId} to paid:`, updateError);
        } else {
          console.log(`Order ${orderId} marked as paid successfully`);
          
          try {
            // Fetch order and user details
            const { data: orderData } = await supabaseAdmin
              .from("orders")
              .select("*, profiles(full_name, email)")
              .eq("id", orderId)
              .single();

            const { data: itemsData } = await supabaseAdmin
              .from("order_items")
              .select("*, products(name, images)")
              .eq("order_id", orderId);

            if (orderData && itemsData) {
              const customerName = orderData.shipping_name || orderData.profiles?.full_name || "Cliente";
              const customerEmail = orderData.shipping_email || orderData.profiles?.email;
              const totalAmount = orderData.total;
              
              const formattedItems = itemsData.map((item: any) => ({
                name: item.products?.name || "Producto",
                price: item.price,
                quantity: item.quantity,
                image: item.products?.images?.[0] || undefined
              }));

              // Send Customer Confirmation Email
              if (customerEmail) {
                const customerTemplate = getPurchaseConfirmationTemplate({
                  customerName,
                  orderId,
                  items: formattedItems,
                  totalAmount
                });

                await sendEmail({
                  to: customerEmail,
                  subject: customerTemplate.subject,
                  html: customerTemplate.html,
                });
              }

              // Send Admin Notification Email
              const adminTemplate = getAdminPurchaseNotificationTemplate({
                orderId,
                customerName,
                customerEmail: customerEmail || "No proporcionado",
                totalAmount,
                items: formattedItems,
              });

              await sendEmail({
                to: "minerva.alcaraz.joyeria@gmail.com",
                subject: adminTemplate.subject,
                html: adminTemplate.html,
              });
              
              console.log(`Emails sent for order ${orderId}`);
            }
          } catch (emailErr) {
            console.error("Error sending order confirmation emails:", emailErr);
          }
        }

        break;
      }
      // Handle other events if needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
