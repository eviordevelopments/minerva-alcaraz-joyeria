import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendEmail } from "../email/resend";
import {
  getPurchaseConfirmationTemplate,
  getAdminPurchaseNotificationTemplate,
} from "../email/templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface FulfillmentResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  alreadyFulfilled?: boolean;
  emailsSent?: boolean;
  error?: string;
}

/**
 * Fulfills an order idempotently after successful payment.
 * Can be called safely from Stripe Webhook OR from Client Confirmation API.
 */
export async function fulfillOrder({
  orderId,
  paymentIntentId,
}: {
  orderId?: string;
  paymentIntentId?: string;
}): Promise<FulfillmentResult> {
  try {
    if (!orderId && !paymentIntentId) {
      throw new Error("orderId or paymentIntentId is required");
    }

    // 1. Fetch PaymentIntent if provided to verify status
    let paymentIntent: Stripe.PaymentIntent | null = null;
    if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        throw new Error(
          `PaymentIntent ${paymentIntentId} has status "${paymentIntent.status}", expected "succeeded"`
        );
      }
      if (!orderId && paymentIntent.metadata?.orderId) {
        orderId = paymentIntent.metadata.orderId;
      }
    }

    // 2. Fetch order with profiles
    let query = supabaseAdmin
      .from("orders")
      .select("*, profiles(id, full_name, email, phone, circle_points, is_circle_member, circle_tier)");

    if (orderId) {
      query = query.eq("id", orderId);
    } else if (paymentIntentId) {
      query = query.eq("payment_reference", paymentIntentId);
    }

    const { data: orderData, error: orderError } = await query.maybeSingle();

    if (orderError || !orderData) {
      throw new Error(`Order not found for orderId: ${orderId}, paymentIntentId: ${paymentIntentId}`);
    }

    const targetOrderId = orderData.id;

    // Check idempotency: If order is already paid, do not re-process stock or duplicate emails
    if (
      orderData.status === "paid" ||
      orderData.status === "completed" ||
      orderData.status === "shipped" ||
      orderData.status === "delivered"
    ) {
      console.log(`[fulfillOrder] Order ${targetOrderId} is already fulfilled with status: ${orderData.status}`);
      return {
        success: true,
        orderId: targetOrderId,
        orderNumber: orderData.order_number,
        alreadyFulfilled: true,
      };
    }

    // 3. Mark order as paid
    const updatePayload: Record<string, any> = {
      status: "paid",
      payment_confirmed_at: new Date().toISOString(),
    };
    if (paymentIntentId && !orderData.payment_reference) {
      updatePayload.payment_reference = paymentIntentId;
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", targetOrderId);

    if (updateError) {
      throw new Error(`Failed to update order ${targetOrderId} to paid: ${updateError.message}`);
    }

    // 4. Fetch order items for inventory decrement and email formatting
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*, products(id, name, sku, stock, is_unique_piece, is_active, images)")
      .eq("order_id", targetOrderId);

    if (itemsError) {
      console.error(`[fulfillOrder] Error fetching order_items for order ${targetOrderId}:`, itemsError);
    }

    // 5. Decrement Stock & Serialized Inventory
    if (itemsData && itemsData.length > 0) {
      for (const item of itemsData) {
        const prodId = item.product_id;
        if (!prodId) continue;

        try {
          // Fetch freshest product data
          const { data: currentProd } = await supabaseAdmin
            .from("products")
            .select("id, stock, is_unique_piece, is_active, sku")
            .eq("id", prodId)
            .single();

          if (currentProd) {
            const currentStock = currentProd.stock ?? 1;
            const newStock = Math.max(0, currentStock - (item.quantity || 1));
            const shouldDeactivate = newStock === 0 || currentProd.is_unique_piece;

            await supabaseAdmin
              .from("products")
              .update({
                stock: newStock,
                is_active: shouldDeactivate ? false : currentProd.is_active,
              })
              .eq("id", prodId);

            console.log(
              `[fulfillOrder] Product ${currentProd.sku} stock updated: ${currentStock} -> ${newStock} (is_active: ${!shouldDeactivate})`
            );
          }

          // Also update inventario_serializado if present
          try {
            await supabaseAdmin
              .from("inventario_serializado")
              .update({ disponible: false })
              .or(`producto_id.eq.${prodId},numero_serie_unico.eq.${item.product_sku}`);
          } catch (serialErr) {
            // Non-blocking in case table structure differs
            console.warn(`[fulfillOrder] Serialized inventory update warning:`, serialErr);
          }
        } catch (stockErr) {
          console.error(`[fulfillOrder] Failed to decrement stock for item ${item.id}:`, stockErr);
        }
      }
    }

    // 6. Update THE CIRCLE membership & points for authenticated users
    if (orderData.user_id) {
      try {
        const currentPoints = orderData.profiles?.circle_points || 0;
        let addedPoints = 0;
        if (orderData.total_cents > 200000) {
          addedPoints = 1000;
        }

        const newPoints = currentPoints + addedPoints;
        let newTier = orderData.profiles?.circle_tier || "Observer";
        if (newPoints >= 20000) newTier = "Eternal";
        else if (newPoints >= 10000) newTier = "Keeper";
        else if (newPoints >= 3000) newTier = "Devotee";
        else if (newPoints >= 1000) newTier = "Initiate";

        await supabaseAdmin
          .from("profiles")
          .update({
            is_circle_member: true, // Automatically becomes a member on purchase
            circle_points: newPoints,
            circle_tier: newTier,
          })
          .eq("id", orderData.user_id);

        console.log(`[fulfillOrder] THE CIRCLE profile updated for user ${orderData.user_id}`);
      } catch (circleErr) {
        console.error(`[fulfillOrder] Error updating THE CIRCLE membership:`, circleErr);
      }
    }

    // 7. Resolve Customer Email safely from multiple sources
    let customerEmail: string | undefined =
      (orderData as any).shipping_email ||
      orderData.profiles?.email ||
      paymentIntent?.metadata?.customer_email ||
      paymentIntent?.receipt_email;

    if (!customerEmail && paymentIntent) {
      const charge = paymentIntent.latest_charge as any;
      if (typeof charge === "object" && charge?.billing_details?.email) {
        customerEmail = charge.billing_details.email;
      }
    }

    const customerName =
      orderData.shipping_name ||
      orderData.profiles?.full_name ||
      paymentIntent?.metadata?.customer_name ||
      "Cliente Distinguido";

    const totalAmount = orderData.total_cents
      ? orderData.total_cents / 100
      : (orderData as any).total || 0;

    // 8. Format items for email without NaN
    const formattedItems = (itemsData || []).map((item: any) => {
      const unitPrice =
        typeof item.unit_price_cents === "number"
          ? item.unit_price_cents / 100
          : typeof item.price === "number"
          ? item.price
          : item.subtotal_cents
          ? item.subtotal_cents / 100 / (item.quantity || 1)
          : 0;

      return {
        name: item.product_name || item.products?.name || "Joya de Autor",
        price: unitPrice,
        quantity: item.quantity || 1,
        image: item.product_image || item.products?.images?.[0] || undefined,
      };
    });

    // 9. Send Confirmation Emails
    let emailsSent = false;
    try {
      if (customerEmail) {
        const customerTemplate = getPurchaseConfirmationTemplate({
          customerName,
          orderId: orderData.order_number || targetOrderId,
          items: formattedItems,
          totalAmount,
        });

        await sendEmail({
          to: customerEmail,
          subject: `💎 Confirmación de Adquisición · Orden ${orderData.order_number || targetOrderId} ✨`,
          html: customerTemplate,
        });
        console.log(`[fulfillOrder] Customer confirmation email sent to ${customerEmail}`);
      } else {
        console.warn(`[fulfillOrder] No customer email found for order ${targetOrderId}`);
      }

      // Always send Atelier Admin Notification
      const adminTemplate = getAdminPurchaseNotificationTemplate({
        orderId: orderData.order_number || targetOrderId,
        customerName,
        customerEmail: customerEmail || "No proporcionado",
        totalAmount,
        items: formattedItems,
      });

      await sendEmail({
        to: "minerva.alcaraz.joyeria@gmail.com",
        subject: `💰 Nueva Compra Recibida - Orden ${orderData.order_number || targetOrderId}`,
        html: adminTemplate,
      });
      console.log(`[fulfillOrder] Atelier notification email sent to admin`);

      emailsSent = true;
    } catch (emailErr) {
      console.error(`[fulfillOrder] Error dispatching confirmation emails:`, emailErr);
    }

    return {
      success: true,
      orderId: targetOrderId,
      orderNumber: orderData.order_number,
      emailsSent,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido en fulfillment";
    console.error("[fulfillOrder Fatal Error]:", message);

    // Dispatch immediate anomaly alert to eviordevelopments@gmail.com and admin panel
    try {
      const { sendAnomalyAlert } = await import("../monitoring/alerts");
      await sendAnomalyAlert({
        type: "FULFILLMENT_ERROR",
        orderId,
        paymentIntentId,
        error: message,
      });
    } catch (alertErr) {
      console.error("[fulfillOrder] Failed to send anomaly alert:", alertErr);
    }

    return {
      success: false,
      error: message,
    };
  }
}
