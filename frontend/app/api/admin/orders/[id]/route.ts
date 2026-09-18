import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "../../../../../lib/email/resend";
import { getOrderDeliveredTemplate } from "../../../../../lib/email/templates";

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

    // Fetch order details + profiles
    const { data: order, error: orderError } = await supabaseAdmin
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

    // Fetch order items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    return NextResponse.json({ order, items });
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
    if (status === "delivered") updates.delivered_at = new Date().toISOString();

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

    // If transitioned to shipped, deduct stock
    if (currentOrder && currentOrder.status !== "shipped" && status === "shipped") {
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", id);

      if (items && items.length > 0) {
        for (const item of items) {
          if (item.product_id) {
            // Fetch current stock
            const { data: product } = await supabaseAdmin
              .from("products")
              .select("stock")
              .eq("id", item.product_id)
              .single();
              
            if (product) {
              const newStock = Math.max(0, product.stock - item.quantity);
              await supabaseAdmin
                .from("products")
                .update({ stock: newStock })
                .eq("id", item.product_id);
            }
          }
        }
      }
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
            subject: deliveredTemplate.subject,
            html: deliveredTemplate.html,
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
